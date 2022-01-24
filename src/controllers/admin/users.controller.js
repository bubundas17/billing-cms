/**
 * @description Render dashboard page
 *
 * @param {object} req
 * @param {object} res
 */
export const getClients = (req, res) => {
  res.render('admin/users', {
    pathName: 'Users',
  });
};

export const getClientDetails = (req, res) => {
  res.render('admin/users/details', {
    pathName: 'User Details',
  });
};
