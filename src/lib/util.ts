import { join, basename } from 'path';
import { access, lstat, readdir, readFile, cp, rm } from 'fs/promises';

// TODO - Add proper error handling
// TODO - Never return empty strings, nulls or undefined from this class methods, always throw errors

class Util {
  static async readDir(...path: string[]): Promise<string[] | never> {
    try {
      return await readdir(join(...path), 'utf-8');
    } catch (_) {
      return [];
    }
  }

  static async readFile(...path: string[]): Promise<string | never> {
    try {
      return await readFile(join(...path), 'utf-8');
    } catch (_) {
      return '';
    }
  }

  static async isDir(...path: string[]): Promise<boolean> {
    try {
      const state = await lstat(join(...path));
      return state.isDirectory();
    } catch (error) {
      return false;
    }
  }

  static async isFile(...path: string[]): Promise<boolean> {
    try {
      const isDir = await this.isDir(...path);
      return isDir ? false : true;
    } catch (error) {
      return false;
    }
  }

  static parseJsonToObject(str: string): object {
    try {
      return JSON.parse(str);
    } catch (error) {
      return {};
    }
  }

  static async isDirOrFileExists(...path: string[]): Promise<boolean> {
    try {
      await access(join(...path));
      return true;
    } catch (_) {
      return false;
    }
  }

  static generateRandomString(length: number): string {
    length = typeof length === 'number' ? length : 5;
    const characters =
      '123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let str = '';
    for (let i = 0; i <= length; i++) {
      str += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return str;
  }

  static async copyFileAndFolder({
    from,
    to,
  }: {
    from: string[];
    to: string[];
  }): Promise<boolean> {
    try {
      await cp(join(...from), join(...to), { recursive: true });
      return true;
    } catch (error) {
      return false;
    }
  }

  static async deleteFileAndFolder(...path: string[]): Promise<boolean> {
    try {
      await rm(join(...path), { recursive: true });
      return true;
    } catch (_) {
      return false;
    }
  }

  static getFileName(file: string, ext = ''): string {
    return basename(file, ext);
  }
}

export default Util;
