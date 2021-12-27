import createError from 'http-errors';

/**
 * @description Render 4xx page for errors
 *
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
export const get4xx = (req, res, next) => {
  const error = createError.NotFound();
  next(error);
};

/**
 * @description Render 5xx page (internal server error)
 *
 * @param {*} error
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
export const get5xx = (error, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = error;
  res.status(status).render('error', { message, status });
};
