import UserApi from '@core/api/users.api';
import { Request, Response } from 'express';
import { User } from '@models/user.model';

export const getProfile = async (req: Request, res: Response) => {
  const user = await UserApi.getUserById(req.user.id);
  res.load('clientarea/profile', {
    layout: 'clientarea',
    user,
  });
};

export const postProfile = async (req: Request, res: Response) => {
  await UserApi.updateUserSafe(req.user.id, req.body as User);
  res.redirect('/clientarea/profile');
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
