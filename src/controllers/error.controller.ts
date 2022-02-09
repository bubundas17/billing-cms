import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

// Render 4xx page for errors
export const get4xx = (_req: Request, _res: Response, next: NextFunction) => {
  const error = new createError.NotFound();
  next(error);
};

// Render 5xx page (internal server error)
export const get5xx = (
  error: never,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const { status = 500, message = 'Something went wrong' } = error;
  res.status(status).render('error', { message, status });
};
