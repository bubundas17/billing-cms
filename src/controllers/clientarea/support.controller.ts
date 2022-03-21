import { Request, Response } from 'express';
import moment from 'moment';

import TicketApi from '@core/api/ticket.api';
import AppError from '@exceptions/AppError';

export const getTickets = async (_req: Request, res: Response) => {
  const tickets = await TicketApi.getTickets();

  res.load('clientarea/tickets/index', {
    tickets: tickets.map((ticket) => ({
      ...ticket,
      createdAt: moment(ticket.createdAt).fromNow(),
    })),
  });
};

export const getNewTicket = async (_req: Request, res: Response) => {
  res.load('clientarea/tickets/new', {});
};

export const postNewTicket = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    await TicketApi.createTicket({ ...req.body, createdBy: user._id });

    req.flash('success', 'Ticket created successfully');
    res.redirect('/clientarea/tickets');
  } catch (error) {
    req.flash('error', (error as AppError).message || 'Something went wrong');

    return res.load('clientarea/tickets/new', {
      ...req.body,
      _errors: req.flash('error'),
    });
  }
};

export const getViewTicket = async (_req: Request, res: Response) => {
  res.load('clientarea/tickets/view', {});
};
