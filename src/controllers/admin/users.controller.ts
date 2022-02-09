import { Request, Response } from 'express';

// Render dashboard page
export const getClients = (_req: Request, res: Response) =>
  res.render('admin/users', {
    pathName: 'Users',
  });

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
