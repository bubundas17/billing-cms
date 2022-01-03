import pluginDriver from '@lib/plugin-driver';

/**
 * @description Get All Themes
 *
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
export const getIndex = async (_req, res) => {
  pluginDriver.getPluginList();
  res.render('admin/plugins/index');
};
