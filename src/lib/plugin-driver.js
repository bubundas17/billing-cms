import { cwd } from 'process';
import fs from 'fs';

import directoryScanner from '@utils/directory-scanner';

class PluginDriver {
  constructor() {}

  /**
   * @description Read Plugins from the plugins directory and return an array of plugin objects
   * @returns {Array<Object>}
   */
  getPluginList() {
    // read the plugins directory
    const pluginList = directoryScanner(cwd() + '/plugins/*/plugin.json');
    console.log(
      pluginList.map(this.getPluginNameFromPath).map(this.getPluginInfo),
    );
  }

  /**
   * @description Read Plugin info from the plugin.json file
   * @param {string} pluginName
   * @returns {Object}
   */

  getPluginInfo(pluginName) {
    // read the plugin.json file
    let pluginPath = cwd() + '/plugins/' + pluginName + '/plugin.json';
    let pluginInfo = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
    return pluginInfo;
  }

  getPluginNameFromPath(pluginPath) {
    // get the plugin name from the plugin path /Users/bubun/Projects/billing-cms/plugins/hello-world/plugin.json => hello-world

    let path = pluginPath.split('/');
    let pluginName = path[path.length - 2];
    return pluginName;
  }
}

export default new PluginDriver();
