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

export const getSecurityCenter = async (_req: Request, res: Response) => {
  res.load('clientarea/security-center', {
    layout: 'clientarea',
  });
};
