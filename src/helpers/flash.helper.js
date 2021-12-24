export const flash = (req, res, next) => {
  req.flash = (type, message) => {
    /*
     * type: 'success', 'info', 'warning', 'danger'
     * message: string
     */
    res.cookie('flash', { type, message }, {
      maxAge: 1000 * 60 * 3,
      httpOnly: false,
    });
  };
  next();
};
