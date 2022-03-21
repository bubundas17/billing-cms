import TicketModel, { Ticket } from '@models/ticket.model';

class TicketApi {
  static async createTicket(ticket: Ticket): Promise<Ticket> {
    return await new TicketModel(ticket).save();
  }

  static async getTickets(): Promise<Ticket[]> {
    return await TicketModel.find().lean();
  }
}

Object.freeze(TicketApi);
export default TicketApi;
