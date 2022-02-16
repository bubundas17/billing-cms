import { NextFunction, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

import UserModel from '@models/user.model';
import pluginDriver from '@lib/plugin-driver';

import UserApi from '@core/api/users.api';
import EmailTemplates from '@enums/email_templates.enum';
import emailSenderService from '@services/email.sender.service';
import CreateUserDto from '@dto/create-user.dto';
import mappedErrors from '@utils/mapped-errors';
import SignInUserDto from '@dto/signin-user.dto';

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
export const getResetPassword = async (req: Request, res: Response) => {
  if (req.query.token) {
    const userinfo = await UserApi.readPasswordResetToken(
      req.query.token as string,
    );
    if (userinfo) {
      res.render('auth/reset-password', {
        pathName: 'reset-password',
        layout: 'auth',
        action: 'reset',
        userinfo,
      });
    } else {
      res.render('auth/reset-password', {
        pathName: 'reset-password',
        layout: 'auth',
        action: 'reset',
        userinfo: false,
      });
    }
    return;
  }
  res.render('auth/reset-password', {
    pathName: 'reset-password',
    layout: 'auth',
  });
};

// post Password reset link
export const postResetPassword = async (req: Request, res: Response) => {
  if (req.query.token) {
    const userinfo = await UserApi.readPasswordResetToken(
      req.query.token as string,
    );
    if (userinfo) {
      // update password
      await UserApi.changePassword(userinfo, req.body.password);
      req.flash('success', 'Password Successfully Changed');
      await emailSenderService.sendEmail(
        userinfo,
        EmailTemplates.CHANGED_PASSWORD,
        {
          subject: 'Your Password Has Beeen Changed',
          info: {},
        },
      );
      // login
      return res.redirect('/auth/login');
    } else {
      return res.redirect('/auth/reset-password');
    }
  }
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
  try {
    const userInput = plainToInstance(CreateUserDto, req.body);

    let errors: ValidationError[] | Record<string, string> = await validate(
      userInput,
    );
    if (errors.length > 0) {
      errors = mappedErrors(errors);
      return res.render('auth/signup', {
        pathName: 'signup',
        layout: 'auth',
        errors,
        userInput,
      });
    }

    errors = {};
    const emailUser = await UserModel.findOne({ email: userInput.email });
    const usernameUser = await UserModel.findOne({
      username: userInput.username,
    });

    if (emailUser) errors.email = 'Email already in used';
    if (usernameUser) errors.username = 'Username already in used';

    if (Object.keys(errors).length > 0) {
      return res.render('auth/signup', {
        pathName: 'signup',
        layout: 'auth',
        errors,
        userInput,
      });
    }

    const user = new UserModel(userInput);
    await user.save();

    req.flash('success', 'You are now registered and can log in');

    return res.redirect('/auth/signin');
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
  const userInput = plainToInstance(SignInUserDto, req.body);

  const errors: ValidationError[] | Record<string, string> = await validate(
    userInput,
  );

  await pluginDriver.executeHook('onSignIn', userInput);
  await pluginDriver.executeHook('onSignInError', errors);

  const options: Record<string, unknown> = {
    pathName: 'signin',
    userInput,
    layout: 'auth',
  };

  if (errors.length > 0) options.errors = mappedErrors(errors);

  return res.render('auth/signin', { ...options, message: req.flash() });
};

// Sign out a signed in user
export const getSignOut = (req: Request, res: Response) => {
  req.logout();
  res.redirect('/auth/signin');
};
