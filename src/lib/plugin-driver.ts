import { cwd } from 'process';
import { join } from 'path';
import fs from 'fs';

import directoryScanner from '@utils/directory-scanner';
import { getOption, setOption } from '@lib/options';

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

  // Read Plugins from the plugins directory and return an array of plugin objects
  async getPluginList() {
    const pluginList = directoryScanner(
      cwd() + '/plugins/*/' + this.pluginMetaFileName,
    );

    const plugins: PluginProperties[] = [];

    for (const plugin of pluginList) {
      const pluginName = this.getPluginNameFromPath(plugin);
      const info = await this.getPluginInfo(pluginName);
      plugins.push(info);
    }
    return plugins;
  }

  // Read Plugin info from the plugin.json file
  async getPluginInfo(pluginName: string): Promise<PluginProperties> {
    const pluginPath = join(
      cwd(),
      'plugins',
      pluginName,
      this.pluginMetaFileName,
    );

    const pluginInfo: PluginInfo = JSON.parse(
      fs.readFileSync(pluginPath, 'utf8'),
    );

    const active = await getOption('is-active-plugin:' + pluginName);
    const isActive = active === 'true';

    return {
      name: pluginName,
      baseDir: join(cwd(), 'plugins', pluginName),
      active: isActive,
      pluginInfo: pluginInfo,
    } as PluginProperties;
  }

  //Activate a Plugin
  async activatePlugin(pluginName: string) {
    await setOption('is-active-plugin:' + pluginName, 'true');
    await this.executeHook('onActive', {}, pluginName);
  }

  // Deactivate a Plugin
  async deactivatePlugin(pluginName: string) {
    await setOption('is-active-plugin:' + pluginName, 'false');
    await this.executeHook('onDeactivate', {}, pluginName);
  }

  /**
   * @description Execute a Plugin Hook
   *  @example
   * await pluginDriver.executeHook('onActive');
   * await pluginDriver.executeHook('onActive', { test: 'test' });
   * await pluginDriver.executeHook('onActive', { test: 'test' }, 'test-plugin');
   */
  async executeHook(
    hookName: string,
    context: object,
    pluginName?: string,
  ): Promise<void> {
    let plugins = await this.getPluginList();
    if (pluginName) {
      plugins = plugins.filter((plugin) => plugin.name === pluginName);
    }
    for (const plugin of plugins) {
      if (plugin.active || plugin.name === pluginName) {
        const pluginPath = join(plugin.baseDir, this.hooksFileName);

        if (fs.existsSync(pluginPath)) {
          const funcs = await import(pluginPath);
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
    const path = pluginPath.split('/');
    const pluginName = path[path.length - 2];
    return pluginName;
  }
}

export default new PluginDriver();
