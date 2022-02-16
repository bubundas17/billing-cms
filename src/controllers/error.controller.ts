import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import createError from 'http-errors';

// Render 4xx page for errors
export const get4xx = (_req: Request, _res: Response, next: NextFunction) => {
  const error = new createError.NotFound();
  next(error);
};

// Render 5xx page (internal server error)
export const get5xx: ErrorRequestHandler = (error, _req, res, _next) => {
  console.log(error);

  const { status = 500, message = 'Something went wrong' } = error;
  return res.status(status).render('error', { message, status });
};
