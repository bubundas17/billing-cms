import { join, normalize } from 'path';
import { cwd } from 'process';
import { rm } from 'fs/promises';
import { watch } from 'fs';
import express from 'express';
import { readdir } from 'fs/promises';

import { compile, registerHelper, create } from 'handlebars';
import directoryScanner from '@utils/directory-scanner';

import util from '@lib/util';
import { deleteOption, getOption } from '@lib/options';

class Theme {
  constructor() {
    this.hbs = create();
    // this.hbs.logger.level = 0;
    this.metadata = {};
  }
  // watch active theme partials folder for changes
  async watchPartials() {
    const currentTheme = await theme.getCurrentTheme();
    const partialsFolderPath = join(currentTheme.absulutePath, 'partials');
    watch(
      partialsFolderPath,
      { recursive: true },
      async (eventType, filename) => {
        this.registerPartials();
      },
    );
  }

  // Register Partials from current active theme
  async registerPartials() {
    let currentTheme = await theme.getCurrentTheme();
    const files = await directoryScanner(
      join(currentTheme.absulutePath, 'partials/**/*.hbs'),
    );

    for (let file of files) {
      const fileData = await util.readFile(file);
      const template = compile(fileData, {
        noEscape: true,
        strict: true,
      });
      let abspath = normalize(file);
      let partialname = abspath
        .replace(join(currentTheme.absulutePath, 'partials/'), '')
        .replace('.hbs', '')
        .replace(/\\/g, '/');
      this.hbs.unregisterPartial(partialname);
      this.hbs.registerPartial(partialname, template);
    }
  }

  // register helpers
  async registerHelpers(app) {
    // TODO: Add a way of setting title for each page in clientarea
    this.hbs.registerHelper('title', function () {
      if (this.title) {
        return `<title>${this.title} - ${this.siteTitle}</title>`;
      }
    });
  }

  async allThemes() {
    try {
      const disabledThemeFileAndFolders = await util.readDir(cwd(), 'themes');
      const themes = disabledThemeFileAndFolders.map(async (path) => {
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
    const result = await getOption('is-active-theme');
    // this.currentTheme = result;
    return result;
  }

  // get theme folder path
  async getThemePath(name) {
    let themeFolderPath = join(cwd(), 'themes', name);
    if (!(await util.isDir(cwd(), 'themes', name))) {
      throw new Error(`Theme ${name} not found`);
    }
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
    return await this.getThemePath(currentTheme);
  }

  async loadTheme(file, options = {}) {
    try {
      const enabledTheme = await this.getEnabledTheme();
      const isThemeAvailable = await this.isThemeAvailable(enabledTheme);
      if (!isThemeAvailable) return '';
      const fileData = await util.readFile(
        cwd(),
        'themes',
        enabledTheme,
        `${file}.hbs`,
      );
      const template = this.hbs.compile(fileData);
      return template({ ...options });
    } catch (err) {
      console.log(err);
      return '';
    }
  }

  async registerThemeEngine(app) {
    app.use(async (req, res, next) => {
      let currentTheme = await theme.getCurrentTheme();
      res.locals.siteTitle = await getOption('siteTitle');
      res.load = async (file, options = {}) => {
        const doc = await theme.loadTheme(file, { ...options, ...res.locals });
        return res.send(doc);
      };
      // console.log(currentTheme);
      res.locals.currentThemeDir = await theme.getCurrentThemePath();
      res.locals.themeBaseUri = currentTheme.themeBaseUri;
      // console.log("A page is requested");

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
    this.registerPartials();
    // watch partials if dev mode
    if (process.env.NODE_ENV !== 'production') {
      this.watchPartials();
    }
    this.registerHelpers();
  }

  // HBS helper functions
}

const theme = new Theme();
export default theme;
