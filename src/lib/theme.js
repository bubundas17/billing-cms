import { join } from 'path';
import { cwd } from 'process';
import { rm } from 'fs/promises';

import util from '@lib/util';
import themeModel from '@models/theme.model';

class Theme {
  async save() {
    try {
      await themeModel.insertMany(await this.allThemes());
    } catch (error) {
      console.error(error);
      throw error;
    }
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
          const result = util.parseJsonToObject(themeJsonData);
          return {
            ...result,
            path: join(cwd(), 'themes', path),
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
      const theme = await themeModel.findOne({ name });
      if (!theme) throw new Error('Theme not found');
      await theme.remove();
      await rm(join(cwd(), 'themes', name), { recursive: true });
      return true;
    } catch (_) {
      return false;
    }
  }
}

const theme = new Theme();
export default theme;
