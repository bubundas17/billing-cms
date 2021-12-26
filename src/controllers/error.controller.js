import createError from 'http-errors';

export const get4xx = (_req, _res, next) => {
  const error = createError.NotFound();
  next(error);
};

export const get5xx = (error, _req, res, _next) => {
  const { status = 500, message = 'Something went wrong' } = error;
  res.status(status).render('error', { message, status });
};
