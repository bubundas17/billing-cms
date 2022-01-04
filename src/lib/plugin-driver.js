import { cwd } from 'process';
import { join } from 'path';
import fs from 'fs';
import directoryScanner from '../utils/directory-scanner';
import { getOption, setOption } from './options';

class PluginDriver {
  constructor() {}

  /**
   * @description Read Plugins from the plugins directory and return an array of plugin objects
   * @returns {Array<Object>}
   */
  async getPluginList() {
    // read the plugins directory
    const pluginList = directoryScanner(cwd() + '/plugins/*/plugin.json');
    let plugins = [];
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

  async getPluginInfo(pluginName) {
    // read the plugin.json file
    let pluginPath = join(cwd(), '/plugins/', pluginName, '/plugin.json');
    let pluginInfo = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
    // check if a plugin is active
    let active = await getOption('is-active-plugin:' + pluginName);
    // console.log(active);
    active = active === 'true';
    return {
      name: pluginName,
      baseDir: join(cwd(), '/plugins/', pluginName),
      active: active,
      pluginInfo: pluginInfo,
    };
  }

  /**
   * @description Activate a Plugin
   * @param {string} pluginName
   * @returns {Promise}
   */
  async activatePlugin(pluginName) {
    // activate the plugin
    await setOption('is-active-plugin:' + pluginName, 'true');
    // run the activate script
    let plugin = join(cwd(), '/plugins/', pluginName, '/plugin.js');
    if (fs.existsSync(plugin)) {
      const funcs = require(plugin);
      if (funcs.onActive) {
        await funcs.onActive();
      }
    }
  }

  /**
   * @description Deactivate a Plugin
   * @param {string} pluginName
   * @returns {Promise}
   */
  async deactivatePlugin(pluginName) {
    // deactivate the plugin
    await setOption('is-active-plugin:' + pluginName, 'false');
    // run the deactivate script
    let plugin = join(cwd(), '/plugins/', pluginName, '/plugin.js');
    if (fs.existsSync(plugin)) {
      const funcs = require(plugin);
      if (funcs.onDeactive) {
        await funcs.onDeactive();
      }
    }
  }

  getPluginNameFromPath(pluginPath) {
    // get the plugin name from the plugin path /Users/bubun/Projects/billing-cms/plugins/hello-world/plugin.json => hello-world

    let path = pluginPath.split('/');
    let pluginName = path[path.length - 2];
    return pluginName;
  }
}

export default new PluginDriver();
