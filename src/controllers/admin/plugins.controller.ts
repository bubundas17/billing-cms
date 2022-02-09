import { Request, Response } from 'express';

import pluginDriver from '@lib/plugin-driver';

// Get All Plugins
export const getIndex = async (_req: Request, res: Response) => {
  const plugins = await pluginDriver.getPluginList();
  res.render('admin/plugins/index', { plugins });
};

// enable a Plugin
export const enable = async (req: Request, res: Response) => {
  const pluginName = req.params.pluginName;
  await pluginDriver.activatePlugin(pluginName);
  res.redirect('/admin/plugins');
};

// disable a Plugin
export const disable = async (req: Request, res: Response) => {
  const pluginName = req.params.pluginName;
  await pluginDriver.deactivatePlugin(pluginName);
  res.redirect('/admin/plugins');
};
