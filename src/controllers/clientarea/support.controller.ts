// import UserApi from '@core/api/users.api';
import { Request, Response } from 'express';
// import { User } from '@models/user.model';

export const getTickets = async (_req: Request, res: Response) => {
  res.load('clientarea/tickets/index', {});
};

export const getNewTicket = async (_req: Request, res: Response) => {
  res.load('clientarea/tickets/new', {});
};

export const getViewTicket = async (_req: Request, res: Response) => {
  res.load('clientarea/tickets/view', {});
};
