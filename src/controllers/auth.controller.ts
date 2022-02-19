import { NextFunction, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import passport from 'passport';

import UserModel, { User } from '@models/user.model';
import pluginDriver from '@lib/plugin-driver';
import UserApi from '@core/api/users.api';
import EmailTemplates from '@enums/email_templates.enum';
import emailSenderService from '@services/email.sender.service';
import CreateUserDto from '@dto/create-user.dto';
import mappedErrors from '@utils/mapped-errors';
import SignInUserDto from '@dto/signin-user.dto';
import JwtTokenDto from '@dto/jwt-token.dto';
import EmailDto from '@dto/email.dto';
import PasswordDto from '@dto/password.dto';

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
  const tokenQuery = plainToInstance(JwtTokenDto, req.query);

  if (tokenQuery.token) {
    const errors = await validate(tokenQuery);

    if (errors.length > 0) {
      return res.render('auth/reset-password', {
        pathName: 'reset-password',
        layout: 'auth',
        action: 'reset',
      });
    }

    const userinfo = await UserApi.readPasswordResetToken(tokenQuery.token);
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
  } else {
    res.render('auth/reset-password', {
      pathName: 'reset-password',
      layout: 'auth',
    });
  }
};

// post Password reset link
export const postResetPassword = async (req: Request, res: Response) => {
  const tokenQuery = plainToInstance(JwtTokenDto, req.query);

  if (tokenQuery.token) {
    let errors: ValidationError[] | Record<string, string> = await validate(
      tokenQuery,
    );

    if (errors.length > 0) {
      errors = mappedErrors(errors);
      return res.render('auth/reset-password', {
        pathName: 'reset-password',
        layout: 'auth',
        errors,
        userInfo: false,
        action: 'reset',
      });
    }

    const userinfo = await UserApi.readPasswordResetToken(tokenQuery.token);

    if (userinfo) {
      const userInput = plainToInstance(PasswordDto, req.body);

      let errors: ValidationError[] | Record<string, string> = await validate(
        userInput,
      );
      if (errors.length > 0) {
        errors = mappedErrors(errors);
        return res.render('auth/reset-password', {
          pathName: 'reset-password',
          layout: 'auth',
          action: 'reset',
          errors,
          userInput,
          userinfo,
        });
      }

      await UserApi.changePassword(userinfo, userInput.password);
      await emailSenderService.sendEmail(
        userinfo,
        EmailTemplates.CHANGED_PASSWORD,
        {
          subject: 'Your Password Has Been Changed',
          info: {},
        },
      );
      req.flash('success', 'Password Successfully Changed');
      return res.redirect('/auth/signin');
    } else {
      req.flash('error', 'Invalid Token');
      return res.redirect('/auth/reset-password');
    }
  }

  const userInput = plainToInstance(EmailDto, req.body);

  let errors: ValidationError[] | Record<string, string> = await validate(
    userInput,
  );
  if (errors.length > 0) {
    errors = mappedErrors(errors);
    return res.render('auth/reset-password', {
      pathName: 'reset-password',
      layout: 'auth',
      errors,
      userInput,
    });
  }

  errors = {};
  const user = await UserApi.getUserByEmail(userInput.email);
  if (!user) errors.email = 'User not found';

  if (Object.keys(errors).length > 0) {
    return res.render('auth/reset-password', {
      pathName: 'reset-password',
      layout: 'auth',
      errors,
      userInput,
    });
  }

  await UserApi.sendPasswordResetLink(user as User);
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

  if (errors.length > 0) {
    options.errors = mappedErrors(errors);
    return res.render('auth/signin', { ...options });
  }

  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/auth/signin',
    failureFlash: true,
  })(req, res, _next);
};

// Sign out a signed in user
export const getSignOut = (req: Request, res: Response) => {
  req.logout();
  res.redirect('/auth/signin');
};
