/**
 * @description Render dashboard page
 *
 * @param {object} req
 * @param {object} res
 */
export const getDashboard = (req, res) => {
  res.render('admin/dashboard', {
    pathName: 'dashboard',
  });
};
