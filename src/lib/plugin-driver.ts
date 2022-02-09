import { cwd } from 'process';
import { join } from 'path';
import fs from 'fs';

import directoryScanner from '@utils/directory-scanner';
import { getOption, setOption } from '@lib/options';
import { type } from 'os';

type PluginInfo = {
  name: string;
  description: string;
  version: string;
  author: string;
  url: string;
  license: string;
};

type PluginProperties = {
  name: string;
  baseDir: string;
  pluginInfo: PluginInfo;
  active: boolean;
};

class PluginDriver {
  hooksFileName: string;
  pluginMetaFileName: string;

  constructor() {
    this.hooksFileName = 'hooks.js';
    this.pluginMetaFileName = 'plugin.json';
  }

  /**
   * @description Read Plugins from the plugins directory and return an array of plugin objects
   * @returns {Promise}
   */
  async getPluginList() {
    // read the plugins directory
    const pluginList = directoryScanner(
      cwd() + '/plugins/*/' + this.pluginMetaFileName,
    );
    let plugins: PluginProperties[] = [];
    for (let plugin of pluginList) {
      let pluginName = this.getPluginNameFromPath(plugin);
      let info = await this.getPluginInfo(pluginName);
      plugins.push(info);
    }
    return plugins;
  }

  /**
   * @description Read Plugin info from the plugin.json file
   * @param {string} pluginName
   * @returns {Object}
   */

  async getPluginInfo(pluginName: string): Promise<PluginProperties> {
    // read the plugin.json file
    let pluginPath = join(
      cwd(),
      'plugins',
      pluginName,
      this.pluginMetaFileName,
    );
    let pluginInfo: PluginInfo = JSON.parse(
      fs.readFileSync(pluginPath, 'utf8'),
    );
    // check if a plugin is active
    let active = await getOption('is-active-plugin:' + pluginName);
    // console.log(active);
    let isActive = active === 'true';
    return {
      name: pluginName,
      baseDir: join(cwd(), 'plugins', pluginName),
      active: isActive,
      pluginInfo: pluginInfo,
    } as PluginProperties;
  }

  /**
   * @description Activate a Plugin
   * @param {string} pluginName
   * @returns {Promise}
   */
  async activatePlugin(pluginName: string) {
    // activate the plugin
    await setOption('is-active-plugin:' + pluginName, 'true');
    // run the activate script
    await this.executeHook('onActive', {}, pluginName);
  }

  /**
   * @description Deactivate a Plugin
   * @param {string} pluginName
   * @returns {Promise}
   */
  async deactivatePlugin(pluginName) {
    // deactivate the plugin
    await setOption('is-active-plugin:' + pluginName, 'false');
    // run the deactivate hook
    await this.executeHook('onDeactivate', {}, pluginName);
  }

  /**
   * @description Execute a Plugin Hook
   * @param {string} hookName
   * @param {object} context
   * @param {string} pluginName - optional
   * @returns {Promise}
   * @example
   * await pluginDriver.executeHook('onActive');
   * await pluginDriver.executeHook('onActive', { test: 'test' });
   * await pluginDriver.executeHook('onActive', { test: 'test' }, 'test-plugin');
   */
  async executeHook(hookName: string, context: object, pluginName: string): Promise<void> {
    let plugins = await this.getPluginList();
    if (pluginName) {
      plugins = plugins.filter((plugin) => plugin.name === pluginName);
    }
    for (let plugin of plugins) {
      if (plugin.active || plugin.name === pluginName) {
        let pluginPath = join(plugin.baseDir, this.hooksFileName);
        if (fs.existsSync(pluginPath)) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const funcs = require(pluginPath);
          if (
            typeof funcs === 'object' &&
            funcs[hookName] &&
            typeof funcs[hookName] === 'function'
          ) {
            await funcs[hookName](context);
          }
        }
      }
    }
  }
  getPluginNameFromPath(pluginPath: string): string {
    // get the plugin name from the plugin path /Users/bubun/Projects/billing-cms/plugins/hello-world/plugin.json => hello-world

    let path = pluginPath.split('/');
    let pluginName = path[path.length - 2];
    return pluginName;
  }
}

export default new PluginDriver();
