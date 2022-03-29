import { Request, Response } from 'express';
import moment from 'moment';

import TicketApi from '@core/api/ticket.api';
import AppError from '@exceptions/AppError';
import { User } from '@models/user.model';

export const getTickets = async (_req: Request, res: Response) => {
  const tickets = await TicketApi.getTickets({
    createdBy: res.locals.user._id,
  });

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

    const attachments = (req.files as Express.Multer.File[])?.map(
      (file) => file.filename,
    );

    await TicketApi.createTicket({
      ...req.body,
      attachedFiles: attachments,
      createdBy: user._id,
    });

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

export const getViewTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketApi.getTicket({
      createdBy: res.locals.user._id,
      _id: req.params.id,
    });

    if (!ticket) {
      req.flash('error', 'Ticket not found');
      return res.redirect('/clientarea/tickets');
    }

    res.load('clientarea/tickets/view', {
      ticket,
    });
  } catch (error) {
    req.flash('error', (error as AppError).message || 'Something went wrong');
    return res.redirect('/clientarea/tickets');
  }
};

export const postReplyTicket = async (req: Request, res: Response) => {
  try {
    const user: User = res.locals.user;

    const attachments = (req.files as Express.Multer.File[])?.map(
      (file) => file.filename,
    );

    const repliedTicket = await TicketApi.ticketReply(user, req.params.id, {
      ...req.body,
      attachments,
    });

    if (!repliedTicket) {
      req.flash('error', 'Permission denied');
      return res.redirect('/clientarea/tickets/' + req.params.id);
    }

    req.flash('success', 'Reply added successfully');
    res.status(201).redirect(`/clientarea/tickets/${req.params.id}`);
  } catch (error) {
    req.flash('error', (error as AppError).message || 'Something went wrong');
    return res.redirect(`/clientarea/tickets/${req.params.id}`);
  }
};
