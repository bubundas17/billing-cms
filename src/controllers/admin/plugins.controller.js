import pluginDriver from '../../lib/plugin-driver';

/**
 * @description Get All Plugins
 *
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
export const getIndex = async (_req, res) => {
  let plugins = await pluginDriver.getPluginList();
  // console.log(plugins);
  res.render('admin/plugins/index', { plugins });
};

/**
 * @description enable a Plugin
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
export const enable = async (req, res) => {
  let pluginName = req.params.pluginName;
  // console.log(pluginName);
  await pluginDriver.activatePlugin(pluginName);
  res.redirect('/admin/plugins');
};

/**
 * @description disable a Plugin
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
export const disable = async (req, res) => {
  let pluginName = req.params.pluginName;
  // console.log(pluginName);
  await pluginDriver.deactivatePlugin(pluginName);
  res.redirect('/admin/plugins');
};
