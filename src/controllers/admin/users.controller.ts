import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

import pagination from '@lib/pagination';
import UserApi from '@core/api/users.api';
import UserModel from '@models/user.model';

export const getClients = async (req: Request, res: Response) => {
  const searchResult = await UserApi.searchUsers(
    req.query,
    parseInt(String(req.query.page)),
  );

  res.render('admin/users', {
    pathName: 'Users',
    users: searchResult.users,
    searchQuery: req.query,
    pagination: pagination(req, searchResult.totalPages),
  });
};

// get edit profile page
export const getEditProfile = async (req: Request, res: Response) => {
  const isIdValid = isValidObjectId(req.params.id);
  if (isIdValid) {
    const user = await UserApi.getUserById(String(req.params.id));
    console.log(user);
  }

  res.render('admin/users/profile', {
    pathName: 'User Details',
    user: {},
  });
};

// Render client profile page
export const getClientProfile = async (_req: Request, res: Response) => {
  const user = await UserModel.findOne().lean();

  res.render('admin/users/profile', {
    pathName: 'User Details',
    user,
  });
};

// Render client summary page
export const getClientSummary = (_req: Request, res: Response) =>
  res.render('admin/users/summary', {
    pathName: 'User Summary',
  });
