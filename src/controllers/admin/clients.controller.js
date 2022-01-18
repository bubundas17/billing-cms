/**
 * @description Render dashboard page
 *
 * @param {object} req
 * @param {object} res
 */
export const getClients = (req, res) => {
  res.render('admin/clients', {
    pathName: 'Clients',
  });
};
