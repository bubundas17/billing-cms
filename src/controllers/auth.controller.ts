import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

import UserModel from '@models/user.model';
import mappedErrors from '@utils/mapped-errors';
import pluginDriver from '@lib/plugin-driver';

// Render the sign up page
export const getSignUp = (_req: Request, res: Response) => {
  res.render('auth/signup', {
    pathName: 'signup',
    layout: 'auth',
  });
};

// Render the sign in page
export const getSignIn = (_req: Request, res: Response) => {
  res.render('auth/signin', {
    pathName: 'signin',
    layout: 'auth',
  });
};

// Render the sign in page
export const getResetPassword = (_req: Request, res: Response) => {
  res.render('auth/reset-password', {
    pathName: 'reset-password',
    layout: 'auth',
  });
};

// Sign up a new user
export const postSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, address, password, confirmPassword } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/signup', {
        name,
        email,
        address,
        password,
        confirmPassword,
        errors: mappedErrors(errors.array()),
        pathName: 'signup',
        layout: 'auth',
      });
    }

    const user = new UserModel({ name, email, password, address });
    await user.save();
    res.redirect('/auth/signin');
  } catch (error) {
    next(error);
  }
};

// Sign in a user
export const postSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  console.log(email, password);

  const errors = validationResult(req);
  // @ts-ignore
  await pluginDriver.executeHook('onSignIn', { email, password });
  // @ts-ignore
  if (errors.isEmpty()) return next();
  // @ts-ignore
  pluginDriver.executeHook('onSignInError', errors);
  return res.render('auth/signin', {
    pathName: 'signin',
    email,
    password,
    errors: mappedErrors(errors.array()),
    layout: 'auth',
  });
};

// Sign out a signed in user
export const getSignOut = (req: Request, res: Response) => {
  req.logout();
  res.redirect('/auth/signin');
};
