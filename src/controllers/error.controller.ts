import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

/**
 * @description Render 4xx page for errors
 *
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
export const get4xx = (_req: Request, _res: Response, next: NextFunction) => {
  const error = new createError.NotFound();
  next(error);
};

/**
 * @description Render 5xx page (internal server error)
 *
 * @param {never} error
 * @param {object} _req
 * @param {object} res
 * @param {Function} _next
 */
export const get5xx = (
  error: never,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const { status = 500, message = 'Something went wrong' } = error;
  res.status(status).render('error', { message, status });
};
