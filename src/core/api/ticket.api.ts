import TicketModel, { Ticket } from '@models/ticket.model';
import { isValidObjectId } from 'mongoose';

class TicketApi {
  static async createTicket(ticket: Ticket): Promise<Ticket> {
    return await new TicketModel(ticket).save();
  }

  static async getTickets(): Promise<Ticket[]> {
    return await TicketModel.find().lean();
  }

  static async getTicketById(id: string) {
    if (!isValidObjectId(id)) {
      throw new Error('Invalid ticket id');
    }
    return await TicketModel.findById(id)
      .populate('createdBy')
      .populate('replies')
      .lean();
  }
}

Object.freeze(TicketApi);
export default TicketApi;
