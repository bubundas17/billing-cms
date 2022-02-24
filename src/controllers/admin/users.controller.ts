import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

import UserModel from '@models/user.model';
import pagination from '@lib/pagination';
import UserApi from '@core/api/users.api';

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

  if (!isIdValid) {
    req.flash('error', 'Invalid user id');
    return res.redirect('/admin/users');
  }

  const user = await UserApi.getUserById(req.params.id);

  res.render('admin/users/profile', {
    pathName: 'User Details',
    user,
  });
};

export const getUserSearch = async (req: Request, res: Response) => {
  const term = req.query.term as string;
  const regex = new RegExp(term, 'i');

  const usersSearchResult = await UserModel.find({ name: regex })
    .limit(10)
    .lean();

  let users: Array<{ id: string; label: string }> = [];
  if (
    usersSearchResult &&
    usersSearchResult.length &&
    usersSearchResult.length > 0
  ) {
    users = usersSearchResult.map((user) => {
      return {
        id: user._id,
        label: user.name,
      };
    });
  }
  return res.json(users);
};

// Render client profile page
export const getClientProfile = async (_req: Request, res: Response) =>
  res.render('admin/users/profile', {
    pathName: 'User Details',
  });

// Render client summary page
export const getClientSummary = (_req: Request, res: Response) =>
  res.render('admin/users/summary', {
    pathName: 'User Summary',
  });
