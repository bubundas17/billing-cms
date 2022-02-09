import { Request, Response } from 'express';

//Render dashboard page
export const getDashboard = (_req: Request, res: Response) =>
  res.render('admin/dashboard', {
    pathName: 'dashboard',
  });
