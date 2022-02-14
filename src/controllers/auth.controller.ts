import { NextFunction, Request, Response } from 'express';

import UserModel from '@models/user.model';
import pluginDriver from '@lib/plugin-driver';

import UserApi from '@core/api/users.api';
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

// post Password reset link
export const postResetPassword = async (req: Request, res: Response) => {
  const email = req.body.email;
  const user = await UserApi.getUserByEmail(email);
  if (!user) {
    req.flash('error', 'User not found');
    return res.redirect('/auth/reset-password');
  }
  await UserApi.sendPasswordResetLink(user);
  req.flash('success', 'Password Reset link Sent!');
  return res.redirect('/auth/reset-password');
};

// Sign up a new user
export const postSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, address, password } = req.body;

  try {
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
  _next: NextFunction,
) => {
  const { email, password } = req.body;

  // @ts-ignore
  await pluginDriver.executeHook('onSignIn', { email, password });

  // @ts-ignore
  pluginDriver.executeHook('onSignInError', errors);

  return res.render('auth/signin', {
    pathName: 'signin',
    email,
    password,
    layout: 'auth',
  });
};

// Sign out a signed in user
export const getSignOut = (req: Request, res: Response) => {
  req.logout();
  res.redirect('/auth/signin');
};
