export const getDashboard = (_req, res) => {
  res.render('admin/dashboard', {
    pathName: 'dashboard',
  });
};
