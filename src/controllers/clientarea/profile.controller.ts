import UserApi from '@core/api/users.api';
import { Request, Response } from 'express';
import { User } from '@models/user.model';

export const getProfile = async (req: Request, res: Response) => {
  const user = await UserApi.getUserById(req.user.id);
  res.load('clientarea/profile', {
    pathName: 'profile',
    layout: 'clientarea',
    user,
  });
};

export const postProfile = async (req: Request, res: Response) => {
  await UserApi.updateUserSafe(req.user.id, req.body as User);
  res.redirect('/clientarea/profile');
};
