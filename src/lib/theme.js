import { join } from 'path';
import { cwd } from 'process';
import { rm } from 'fs/promises';

import util from '@lib/util';
import { deleteOption, getOption } from '@lib/options';

class Theme {
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
    console.log(result);
    return result;
  }
}

const theme = new Theme();
export default theme;
