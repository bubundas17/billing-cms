/**
 * @description Flash message helper
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */

export default (req, res, next) => {
  /**
   * @param {string} type
   * @param {string} message
   */
  req.flash = (type, message) => {
    /*
     * type: 'success', 'info', 'warning', 'danger'
     * message: string
     */
    res.cookie(
      'flash',
      { type, message },
      {
        maxAge: 1000 * 60 * 3,
        httpOnly: false,
      },
    );
  };
  next();
};
