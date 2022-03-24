import { DocumentType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { isNotEmpty } from 'class-validator';
import { FilterQuery, isValidObjectId } from 'mongoose';

import TicketModel, { Ticket, TicketStatus } from '@models/ticket.model';
import { User } from '@models/user.model';

class TicketApi {
  static async createTicket(ticket: Ticket): Promise<Ticket> {
    return await new TicketModel(ticket).save();
  }

  static async getTickets(
    options: FilterQuery<DocumentType<Ticket, BeAnObject>> = {},
  ): Promise<Ticket[]> {
    return await TicketModel.find(options)
      .populate('createdBy')
      .select('-__v,email')
      .sort('-createdAt')
      .lean();
  }

  static async getTicketById(id: string) {
    if (!isValidObjectId(id)) {
      throw new Error('Invalid ticket id');
    }
    return await TicketModel.findById(id)
      .populate('createdBy')
      .populate('replies.repliedBy')
      .lean();
  }

  static async getTicket(
    options: FilterQuery<DocumentType<Ticket, BeAnObject>> = {},
  ) {
    return await TicketModel.findOne(options)
      .populate('createdBy')
      .populate('replies.repliedBy')
      .lean();
  }

  static async ticketReply(
    user: User,
    ticketId: string,
    reply: { [key: string]: unknown },
  ) {
    const isAdmin = user.roles.includes('admin');

    let ticketStatus = TicketStatus.Open;
    const ticketOptions: { [key: string]: string } = {};

    if (isAdmin) {
      ticketOptions['_id'] = ticketId;
      switch (reply['status']) {
        case TicketStatus.Answerd:
          ticketStatus = TicketStatus.Answerd;
          break;
        case TicketStatus.Closed:
          ticketStatus = TicketStatus.Closed;
          break;
        case TicketStatus.OnProgress:
          ticketStatus = TicketStatus.OnProgress;
          break;
        case TicketStatus.Open:
          ticketStatus = TicketStatus.Open;
          break;
        default:
          ticketStatus = TicketStatus.Answerd;
          break;
      }
    } else {
      ticketOptions['createdBy'] = user._id;
      ticketOptions['_id'] = ticketId;
      ticketStatus = TicketStatus.ClientReply;
    }

    const ticket = await TicketModel.findOne(ticketOptions);

    if (!ticket) return false;

    if (isAdmin || ticket.status !== TicketStatus.Closed)
      ticket.status = ticketStatus;

    if (isNotEmpty(reply.body))
      ticket?.replies?.unshift({
        body: String(reply.body),
        repliedBy: user._id,
      });

    await ticket.save();

    return true;
  }
}

Object.freeze(TicketApi);
export default TicketApi;
