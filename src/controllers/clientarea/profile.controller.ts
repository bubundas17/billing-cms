import UserApi from '@core/api/users.api';
import { Request, Response } from 'express';
import { User } from '@models/user.model';
import AppError from '@exceptions/AppError';

export const getProfile = async (req: Request, res: Response) => {
  const user = await UserApi.getUserById(req.user.id);
  res.load('clientarea/profile', {
    layout: 'clientarea',
    user,
  });
};

export const postProfile = async (req: Request, res: Response) => {
  try {
    await UserApi.updateUserSafe(res.locals.user, req.body as User);

    req.flash('success', 'Profile updated successfully');
    res.redirect('/clientarea/profile');
  } catch (error) {
    req.flash('error', (error as AppError)?.message || 'Something went wrong');
    res.redirect('/clientarea/profile');
  }
};

export const getEmailHistory = async (req: Request, res: Response) => {
  const user = await UserApi.getUserById(req.user.id);
  res.load('clientarea/email-history', {
    layout: 'clientarea',
    user,
  });
};

export const getChangePassword = async (_req: Request, res: Response) => {
  res.load('clientarea/change-password', {
    layout: 'clientarea',
  });
};

export const postChangePassword = async (req: Request, res: Response) => {
  const isPasswordMatches = await UserApi.isValidPassword(
    req.body.currentPassword,
    res.locals.user.password,
  );

  if (!isPasswordMatches) {
    req.flash('error', 'Current password is incorrect');
    return res.load('clientarea/security-center', {
      layout: 'clientarea',
      inputs: req.body,
      errors: req.flash('error'),
    });
  }

  // TODO: Add proper validation
  if (
    !req.body.newPassword ||
    (!req.body.confirmPassword &&
      req.body.newPassword !== req.body.confirmPassword)
  ) {
    req.flash('error', 'Please enter new password');
    return res.load('clientarea/security-center', {
      inputs: req.body,
      errors: req.flash('error'),
    });
  }

  const isSuccess = await UserApi.changePassword(
    res.locals.user,
    req.body.newPassword,
  );

  if (!isSuccess) {
    req.flash('error', 'Something went wrong');
    return res.load('clientarea/security-center', {
      inputs: req.body,
      errors: req.flash('error'),
    });
  }

  req.flash('success', 'Password changed successfully');
  res.redirect('/clientarea/security-center');
};

export const getSecurityCenter = async (_req: Request, res: Response) => {
  res.load('clientarea/security-center', {
    layout: 'clientarea',
  });
};
