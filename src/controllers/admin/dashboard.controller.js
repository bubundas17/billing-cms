export const getDashboard = (req, res) => {
  res.render('admin/dashboard', {
    pathName: 'dashboard',
  });
};
