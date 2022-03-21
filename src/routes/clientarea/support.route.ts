import {
  getNewTicket,
  getTickets,
  getViewTicket,
  postNewTicket,
} from '@controllers/clientarea/support.controller';
import BaseRoute from '@routes/base.route';

class SupportTickets extends BaseRoute {
  constructor() {
    super('/clientarea/tickets');
    this.init();
  }

  init() {
    this.router.route('/').get(getTickets);
    this.router.route('/new').get(getNewTicket).post(postNewTicket);
    this.router.route('/:id').get(getViewTicket);
  }
}

export default SupportTickets;
