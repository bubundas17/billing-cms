import { promisify } from 'util';
import { join, basename } from 'path';
import { cwd } from 'process';
import { rm } from 'fs/promises';
import express from 'express';
import globAsync from 'glob';
import Handlebars from 'handlebars';

import util from '@lib/util';
import { deleteOption, getOption } from '@lib/options';

const glob = promisify(globAsync);

// TODO - Add template cache
// TODO - Add theme cache
// TODO - Give users the ability to add their own layouts and helpers
// TODO - Add proper error handling
// TODO - Reduce the amount of code in this file
// TODO - Create perfect res.load method that will load a theme file and pass it to the template

class Theme {
  constructor() {
    this.hbs = Handlebars;
    this.metadata = {};
  }

  getFileName(file, ext = '') {
    return basename(file, ext);
  }

  async getPartials() {
    const theme = await this.getCurrentTheme();

    const dirs = await glob('**/*.hbs', {
      cwd: join(cwd(), 'themes', theme.path, 'partials'),
      follow: true,
    });

    const partials = await dirs.reduce(async (prev, current) => {
      const fileData = await util.readFile(theme.partialsFolderPath, current);
      const template = this.compileTemplate(fileData);
      const _prev = await prev;
      _prev[this.getFileName(current, '.hbs')] = this.renderTemplate(template);
      return prev;
    }, Promise.resolve({}));

    return partials;
  }

  async getTemplate(filePath, options = {}) {
    const theme = await this.getCurrentTheme();
    const fileData = await util.readFile(theme.absulutePath, filePath);
    const template = this.compileTemplate(fileData, options);
    return template;
  }

  async render(filePath, context = {}, options = {}) {
    const partials = await this.getPartials();
    const template = await this.getTemplate(`${filePath}.hbs`, options);
    const layoutTemplate = await this.getTemplate('layouts/main.hbs', options);
    let html = this.renderTemplate(template, context, options);
    html = this.renderTemplate(
      layoutTemplate,
      { ...context, body: html },
      { partials },
    );
    return html;
  }

  compileTemplate(template, options = {}) {
    return this.hbs.compile(template, options);
  }

  precompileTemplate(template, options = {}) {
    return this.hbs.precompile(template, options);
  }

  renderTemplate(template, context = {}, options = {}) {
    return template(context, options).trim();
  }

  async allThemes() {
    try {
      const themeFileAndFolders = await glob('*', { cwd: `${cwd()}/themes` });
      const themes = themeFileAndFolders.map(async (path) => {
        const isDir = await util.isDir(cwd(), 'themes', path);
        if (isDir) {
          const themeFilesAndFolders = await util.readDir(
            cwd(),
            'themes',
            path,
          );
          const themeJsonFileIndex = themeFilesAndFolders.indexOf('theme.json');
          if (themeJsonFileIndex <= -1) return;
          const themeJsonData = await util.readFile(
            cwd(),
            'themes',
            path,
            themeFilesAndFolders[themeJsonFileIndex],
          );
          const active = (await this.getEnabledTheme()) === path;
          const result = util.parseJsonToObject(themeJsonData);
          return {
            ...result,
            path,
            absulutePath: join(cwd(), 'themes', path),
            publicFolderPath: join(cwd(), 'themes', path, 'public'),
            partialsFolderPath: join(cwd(), 'themes', path, 'partials'),
            themeBaseUri: '/themes/' + path,
            active,
          };
        }
      });

      return Promise.all(themes);
    } catch (_) {
      return [];
    }
  }

  async removeTheme(name) {
    try {
      if (typeof name !== 'string' && name.trim() !== '')
        throw new Error('Invalid theme name');
      const currentActiveTheme = await getOption('is-active-theme');
      if (currentActiveTheme === name.trim())
        throw new Error(`You can not uninstall enabled theme ${name.trim()}`);
      const isDone = await deleteOption('is-active-theme');
      if (!isDone) throw new Error('Theme not found');
      await rm(join(cwd(), 'themes', name), { recursive: true });
      return true;
    } catch (_) {
      return false;
    }
  }

  async isThemeAvailable(themeName) {
    try {
      const themes = await this.allThemes();
      const isAvailable = themes.find((t) => t.path === themeName);
      if (!isAvailable) return false;
      return true;
    } catch (_) {
      return false;
    }
  }

  async getEnabledTheme() {
    return await getOption('is-active-theme');
  }

  // get theme folder path
  async getThemePath(name) {
    const themeFolderPath = join(cwd(), 'themes', name);

    if (!(await util.isDir(cwd(), 'themes', name)))
      throw new Error(`Theme ${name} not found`);

    return themeFolderPath;
  }

  // get current active theme
  async getCurrentTheme() {
    const themes = await this.allThemes();
    return themes.find((t) => t.active);
  }

  // get current theme path
  async getCurrentThemePath() {
    const currentTheme = await this.getEnabledTheme();
    const result = await this.getThemePath(currentTheme);
    return result;
  }

  async registerThemeEngine(app) {
    app.use(async (_req, res, next) => {
      let currentTheme = await theme.getCurrentTheme();
      res.locals.siteTitle = await getOption('siteTitle');
      res.load = async (file, options = {}) => {
        const doc = await theme.render(file, { ...options, ...res.locals });
        return res.send(doc);
      };

      res.locals.currentThemeDir = await theme.getCurrentThemePath();
      res.locals.themeBaseUri = currentTheme.themeBaseUri;

      res.title = async (title) => {
        res.locals.title = title;
      };

      next();
    });

    let currentTheme = await theme.getCurrentTheme();
    app.use(
      currentTheme.themeBaseUri,
      express.static(currentTheme.publicFolderPath),
    );
  }
}

const theme = new Theme();
export default theme;
