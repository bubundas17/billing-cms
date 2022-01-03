import { join } from 'path';
import { access, lstat, readdir, readFile, cp, rm, unlink } from 'fs/promises';

class Util {
  async readDir(...path) {
    try {
      return await readdir(join(...path), 'utf-8');
    } catch (_) {
      return [];
    }
  }

  async readFile(...path) {
    try {
      return await readFile(join(...path), 'utf-8');
    } catch (_) {
      return '';
    }
  }

  async isDir(...path) {
    try {
      const state = await lstat(join(...path));
      return state.isDirectory();
    } catch (error) {
      return false;
    }
  }

  parseJsonToObject(str) {
    try {
      return JSON.parse(str);
    } catch (error) {
      return {};
    }
  }

  async isDirOrFileExists(...path) {
    try {
      await access(join(...path));
      return true;
    } catch (_) {
      return false;
    }
  }

  generateRandomString(length) {
    length = typeof length === 'number' ? length : 5;
    const characters =
      '123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let str = '';
    for (let i = 0; i <= length; i++) {
      str += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return str;
  }

  async copyFileAndFolder({ from, to }) {
    try {
      await cp(join(...from), join(...to), { recursive: true });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteFileAndFolder(...path) {
    try {
      await rm(join(...path), { recursive: true });
      return true;
    } catch (_) {
      return false;
    }
  }
}

const util = new Util();
module.exports = util;
