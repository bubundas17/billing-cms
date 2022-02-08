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

export const getClientProfile = (req, res) => {
  res.render('admin/users/profile', {
    pathName: 'User Details',
  });
};

export const getClientSummary = (req, res) =>
  res.render('admin/users/summary', {
    pathName: 'User Summary',
  });
