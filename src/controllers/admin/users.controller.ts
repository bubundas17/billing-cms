import { Request, Response } from 'express';
import pagination from '../../lib/pagination';
import UserApi from '../../core/api/users.api';

// Render dashboard page
export const getClients = async (req: Request, res: Response) => {
  const users = await UserApi.searchUsers(
    String(req.query.q),
    parseInt(String(req.query.page)),
  );
  // console.log(users);
  res.render('admin/users', {
    pathName: 'Users',
    users: users,
    pagination: pagination(req, users.length),
  });
};

// get edit profile page
export const getEditProfile = async (req: Request, res: Response) => {
  const user = await UserApi.getUserById(req.params.id);
  res.render('admin/users/profile', {
    pathName: 'User Details',
    user: user,
  });
};

// Render client profile page
export const getClientProfile = (_req: Request, res: Response) =>
  res.render('admin/users/profile', {
    pathName: 'User Details',
  });

// Render client summary page
export const getClientSummary = (_req: Request, res: Response) =>
  res.render('admin/users/summary', {
    pathName: 'User Summary',
  });
