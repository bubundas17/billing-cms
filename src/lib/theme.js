import { join } from 'path';
import { cwd } from 'process';

import util from './util';

class Theme {
  async readEnabledTheme() {
    try {
      const enabledThemeFileAndFolders = await util.readDir(
        cwd(),
        'themes',
        'enabled',
      );
      const themeJsonFileIndex =
        enabledThemeFileAndFolders.indexOf('theme.json');
      if (themeJsonFileIndex <= -1) return {};
      const themeJsonData = await util.readFile(
        cwd(),
        'themes',
        'enabled',
        enabledThemeFileAndFolders[themeJsonFileIndex],
      );
      const result = util.parseJsonToObject(themeJsonData);
      return { ...result, path: join(cwd(), 'themes', 'enabled') };
    } catch (error) {
      return {};
    }
  }

  async readDisabledThemes() {
    try {
      const disabledThemeFileAndFolders = await util.readDir(
        cwd(),
        'themes',
        'disabled',
      );
      const themes = disabledThemeFileAndFolders.map(async (path) => {
        const isDir = await util.isDir(cwd(), 'themes', 'disabled', path);
        if (isDir) {
          const themeFilesAndFolders = await util.readDir(
            cwd(),
            'themes',
            'disabled',
            path,
          );
          const themeJsonFileIndex = themeFilesAndFolders.indexOf('theme.json');
          if (themeJsonFileIndex <= -1) return;
          const themeJsonData = await util.readFile(
            cwd(),
            'themes',
            'disabled',
            path,
            themeFilesAndFolders[themeJsonFileIndex],
          );
          const result = util.parseJsonToObject(themeJsonData);
          return {
            ...result,
            path: join(cwd(), 'themes', 'disabled', path),
          };
        }
      });

      return Promise.all(themes);
    } catch (_) {
      return [];
    }
  }

  async allThemes() {
    try {
      let enabledTheme = await this.readEnabledTheme();
      let disabledThemes = await this.readDisabledThemes();
      enabledTheme = { ...enabledTheme, enabled: true };
      disabledThemes = disabledThemes.map((theme) => ({
        ...theme,
        enabled: false,
      }));
      return [enabledTheme, ...disabledThemes];
    } catch (_) {
      return [];
    }
  }

  async themeEnabler(identifier) {
    try {
      const enabledTheme = await this.readEnabledTheme();
      if (enabledTheme.uniqueIdentifier === identifier)
        throw new Error('This theme is already enabled');

      const disabledThemes = await this.readDisabledThemes();
      const selectedTheme = disabledThemes.find(
        (theme) => theme.uniqueIdentifier === identifier,
      );
      if (!selectedTheme) throw new Error('Selected theme not installed');
      await util.copyFileAndFolder({
        from: [cwd(), 'themes', 'enabled'],
        to: [cwd(), 'themes', 'disabled', util.generateRandomString(5)],
      });
      await util.deleteFileAndFolder(cwd(), 'themes', 'enabled');
      await util.copyFileAndFolder({
        from: [selectedTheme.path],
        to: [cwd(), 'themes', 'enabled'],
      });
      await util.deleteFileAndFolder(selectedTheme.path);
      return { success: true };
    } catch (error) {
      throw error || new Error('Theme enabler failed');
    }
  }
}

const theme = new Theme();
export default theme;
