import { promisify } from 'util';
import { join, parse } from 'path';
import { cwd } from 'process';
import { rm } from 'fs/promises';
import express, { Express } from 'express';
import globAsync from 'glob';
import Handlebars from 'handlebars';
import { isEmpty } from 'class-validator';

import util from '@lib/util';
import { deleteOption, getOption } from '@lib/options';
import env from '@configs/env.config';

const glob = promisify(globAsync);

// TODO - Add template cache
// TODO - Add theme cache
// TODO - Give users the ability to add their own layouts and helpers
// TODO - Add proper error handling
// TODO - Reduce the amount of code in this file
// TODO - Create perfect res.load method that will load a theme file and pass it to the template

type ThemeType = {
  path: string;
  absulutePath: string;
  templatesAbsulutePath: string;
  publicFolderPath: string;
  partialsFolderPath: string;
  themeBaseUri: string;
  active: boolean;
};

class Theme {
  private hbs: typeof Handlebars;
  private fsCache: { [key: string]: string };

  constructor() {
    this.hbs = Handlebars;
    this.fsCache = {};
  }

  private async getPartials(context = {}) {
    try {
      const theme = await this.getCurrentTheme();

      const dirs = await glob('**/*.hbs', {
        cwd: theme.partialsFolderPath,
        follow: true,
      });

      const partials = await dirs.reduce(async (prev, current) => {
        const fileData = await util.readFile(theme.partialsFolderPath, current);
        // console.log(current);
        const template = this.compileTemplate(fileData, context);
        const _prev = await prev;
        _prev[util.getFileName(current, '.hbs')] =
          this.renderTemplate(template, { ...context }) || '';
        return prev;
      }, Promise.resolve<{ [key: string]: unknown }>({}));

      return partials;
    } catch (error) {
      util.handleError(error as Error);
    }
  }

  private async getTemplate(
    filePath: string,
    options = {},
  ): Promise<HandlebarsTemplateDelegate | undefined | void> {
    try {
      const theme = await this.getCurrentTheme();
      const fileData = await this.readFileAndCache(
        theme.templatesAbsulutePath,
        filePath,
      );
      const template = this.compileTemplate(fileData, options);
      return template;
    } catch (error) {
      util.handleError(error as Error);
    }
  }

  private async readFileAndCache(...path: string[]): Promise<string | never> {
    const filePath = join(...path);
    const cache = this.fsCache;

    if (env.NODE_ENV === 'production') {
      if (cache[filePath]) {
        return cache[filePath];
      } else {
        cache[filePath] = await util.readFile(filePath);
        return cache[filePath];
      }
    } else {
      return await util.readFile(filePath);
    }
  }

  async render(filePath: string, context = {}, options = {}) {
    try {
      if (isEmpty(filePath)) throw new Error('File path must not be empty');

      const { name, dir, ext } = parse(filePath);
      if (isEmpty(ext) || ext === '.hbs') filePath = `${dir}/${name}.hbs`;
      if (!isEmpty(ext) && ext !== '.hbs')
        throw new Error('Invalid file extension, only .hbs is allowed');

      const partials = (await this.getPartials(context)) as {
        [key: string]: HandlebarsTemplateDelegate;
      };

      const template = (await this.getTemplate(
        filePath,
        options,
      )) as HandlebarsTemplateDelegate;

      const layoutTemplate = (await this.getTemplate(
        'layouts/main.hbs',
        options,
      )) as HandlebarsTemplateDelegate;

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
    } catch (error) {
      util.handleError(error as Error);
    }
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

  async allThemes(): Promise<Array<ThemeType>> {
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
            templatesAbsulutePath: join(cwd(), 'themes', path, 'templates'),
            publicFolderPath: join(cwd(), 'themes', path, 'public'),
            partialsFolderPath: join(
              cwd(),
              'themes',
              path,
              'templates',
              'partials',
            ),
            themeBaseUri: '/themes/' + path,
            active,
          };
        }
      });

      return Promise.all(themes) as Promise<Array<ThemeType>>;
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
    const activeTheme = (await getOption('is-active-theme')) as Promise<string>;

    if (!activeTheme) return env.DEFAULT_THEME;

    return activeTheme;
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
    return themes.find((t) => t.active) as ThemeType;
  }

  // get current theme path
  async getCurrentThemePath() {
    const currentTheme = await this.getEnabledTheme();
    const result = await this.getThemePath(currentTheme);
    return result;
  }

  async registerThemeEngine(app: Express) {
    app.use(async (_req, res, next) => {
      const currentTheme = await this.getCurrentTheme();

      res.load = async (file, options = {}) => {
        const doc = await this.render(file, { ...options, ...res.locals });
        return res.send(doc);
      };

      res.title = async (title) => {
        res.locals.title = title;
        return res;
      };

      res.locals.currentThemeDir = await this.getCurrentThemePath();
      res.locals.themeBaseUri = currentTheme.themeBaseUri;

      next();
    });

    const currentTheme = await this.getCurrentTheme();

    // check if functions.js file exists
    const functionsFilePath = join(currentTheme.absulutePath, 'functions.js');
    if (await util.isFile(functionsFilePath)) {
      const functions = await import(functionsFilePath);

      if (typeof functions.init === 'function') {
        functions.init(app);
      }
    }

    // Theme static files
    app.use(
      currentTheme.themeBaseUri,
      express.static(currentTheme.publicFolderPath),
    );
  }
}

const theme = new Theme();
export default theme;
