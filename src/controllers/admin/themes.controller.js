/**
 * @description Get All Themes
 *
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
export const getIndex = async (_req, res) => {
  res.render('admin/themes/index');
};
