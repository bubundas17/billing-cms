import { Request, Response, Express } from 'express';
import moment from 'moment';

import TicketApi from '@core/api/ticket.api';
import { User } from '@models/user.model';
import { getNameLabel, getUserFirstName } from '@helpers/user.helper';
import AppError from '@exceptions/AppError';
import { Reply, TicketStatus } from '@models/ticket.model';

export const getTickets = async (_req: Request, res: Response) => {
  const tickets = await TicketApi.getTickets();

  res.render('admin/tickets', {
    tickets: tickets.map((ticket) => ({
      ...ticket,
      createdAt: moment(ticket.createdAt).fromNow(),
    })),
  });
};

export const getNewTicket = async (_req: Request, res: Response) => {
  res.render('admin/tickets/new');
};

export const postNewTicket = async (req: Request, res: Response) => {
  try {
    const attachments = (req.files as Express.Multer.File[])?.map(
      (file) => file.filename,
    );

    await TicketApi.createTicket({
      ...req.body,
      createdBy: res.locals.user,
      attachedFiles: attachments,
    });

    req.flash('success', 'Ticket created successfully');
    res.redirect('/admin/tickets');
  } catch (error) {
    req.flash('error', 'Error creating ticket');
    res.render('admin/tickets/new', {
      ticket: req.body,
      _errors: req.flash('error'),
    });
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
      return res.redirect('/admin/tickets/' + req.params.id);
    }

    req.flash('success', 'Reply added successfully');
    res.status(201).redirect(`/admin/tickets/${req.params.id}`);
  } catch (error) {
    req.flash('error', (error as AppError).message || 'Something went wrong');
    return res.redirect(`/admin/tickets/${req.params.id}`);
  }
};

export const getViewTicket = async (req: Request, res: Response) => {
  const ticket = await TicketApi.getTicketById(req.params.id);
  if (!ticket) {
    req.flash('error', 'Ticket not found');
    return res.redirect('/admin/tickets');
  }
  const adminTicket = {
    ...ticket,
    createdDate: moment(ticket?.createdAt).format('DD/MM/YYYY'),
    createdTime: moment(ticket?.createdAt).format('h:mm a'),
    createdBy: {
      ...(ticket?.createdBy as User),
      nameLabel: getNameLabel((ticket?.createdBy as User).name || ''),
    },
    replies: ticket?.replies?.map((reply: Reply) => ({
      ...reply,
      repliedBy: {
        ...(reply.repliedBy as User),
        nameLabel: getNameLabel((ticket?.createdBy as User).name || ''),
        firstName: getUserFirstName((reply.repliedBy as User).name || ''),
      },
      createdDate: moment(reply.createdAt).format('DD/MM/YYYY'),
      createdTime: moment(reply.createdAt).format('h:mm a'),
    })),
  };

  res.render('admin/tickets/view', {
    ticket: adminTicket,
  });
};

export const postCloseTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketApi.getTicketById(req.body.ticketId);

    if (!ticket) {
      req.flash('error', 'Ticket not found');
      return res.redirect('/admin/tickets');
    }

    if (ticket.status === TicketStatus.Closed) {
      req.flash('error', 'Ticket already closed');
      return res.redirect('/admin/tickets');
    }

    await TicketApi.ticketReply(res.locals.user, req.body.ticketId, {
      status: TicketStatus.Closed,
    });

    req.flash('success', 'Ticket closed successfully');
    res.redirect('/admin/tickets');
  } catch (error) {
    req.flash('error', 'Error closing ticket');
    res.redirect('/admin/tickets');
  }
};
