import { promisify } from 'util';
import { join, parse } from 'path';
import { cwd } from 'process';
import { rm } from 'fs/promises';
import express, { Express } from 'express';
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
  private hbs: typeof Handlebars;
  private metadata: object;

  constructor() {
    this.hbs = Handlebars;
    this.metadata = {};
  }

  private async getPartials() {
    const theme = await this.getCurrentTheme();

    const dirs = await glob('**/*.hbs', {
      cwd: join(cwd(), 'themes', theme.path, 'partials'),
      follow: true,
    });

    const partials = await dirs.reduce(async (prev, current) => {
      const fileData = await util.readFile(theme.partialsFolderPath, current);
      const template = this.compileTemplate(fileData);
      const _prev = await prev;
      _prev[util.getFileName(current, '.hbs')] = this.renderTemplate(template);
      return prev;
    }, Promise.resolve({}));

    return partials;
  }

  private async getTemplate(filePath: string, options = {}) {
    const theme = await this.getCurrentTheme();
    const fileData = await util.readFile(theme.absulutePath, filePath);
    const template = this.compileTemplate(fileData, options);
    return template;
  }

  private async render(filePath: string, context = {}, options = {}) {
    const { name, dir, ext } = parse(filePath);
    if (ext === '' || ext === '.hbs') filePath = `${dir}/${name}.hbs`;
    if (ext !== '' && ext !== '.hbs')
      throw new Error('Invalid file extension, only .hbs is allowed');

    console.log(filePath);

    const partials = await this.getPartials();
    const template = await this.getTemplate(filePath, options);
    const layoutTemplate = await this.getTemplate('layouts/main.hbs', options);
    let html = this.renderTemplate(
      template,
      { ...context },
      { ...options, partials },
    );
    html = this.renderTemplate(
      layoutTemplate,
      { ...context, body: html },
      { partials },
    );
    return html;
  }

  private compileTemplate(
    template: string,
    options: RuntimeOptions = {},
  ): HandlebarsTemplateDelegate {
    return this.hbs.compile(template, options);
  }

  private precompileTemplate(
    template: string,
    options: RuntimeOptions = {},
  ): TemplateSpecification {
    return this.hbs.precompile(template, options);
  }

  private renderTemplate(
    template: HandlebarsTemplateDelegate,
    context: object = {},
    options: RuntimeOptions = {},
  ) {
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

  async removeTheme(name: string): Promise<boolean> {
    try {
      if (typeof name !== 'string') throw new Error('Invalid theme name');

      name = name.trim();
      const currentActiveTheme = await getOption('is-active-theme');
      if (currentActiveTheme === name)
        throw new Error(`You can not uninstall enabled theme ${name}`);

      const isDone = await deleteOption('is-active-theme');
      if (!isDone) throw new Error('Theme not found');

      await rm(join(cwd(), 'themes', name), { recursive: true });
      return true;
    } catch (_) {
      return false;
    }
  }

  async isThemeAvailable(themeName: string) {
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
  async getThemePath(name: string) {
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

  async registerThemeEngine(app: Express) {
    app.use(async (_req, res, next) => {
      const currentTheme = await theme.getCurrentTheme();

      res.locals.siteTitle = await getOption('siteTitle');

      res.load = async (file, options = {}) => {
        const doc = await theme.render(file, { ...options, ...res.locals });
        return res.send(doc);
      };

      res.locals.currentThemeDir = await theme.getCurrentThemePath();
      res.locals.themeBaseUri = currentTheme.themeBaseUri;

      res.title = async (title: string) => (res.locals.title = title);

      next();
    });

    const currentTheme = await theme.getCurrentTheme();

    app.use(
      currentTheme.themeBaseUri,
      express.static(currentTheme.publicFolderPath),
    );
  }
}

const theme = new Theme();
export default theme;
