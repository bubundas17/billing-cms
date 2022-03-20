import {
  getNewTicket,
  getTickets,
  getViewTicket,
} from '@controllers/clientarea/support.controller';
import BaseRoute from '@routes/base.route';

class SupportTickets extends BaseRoute {
  constructor() {
    super('/clientarea/tickets');
    this.init();
  }

  init() {
    // TODO - initialize
    this.router.route('/').get(getTickets);
    this.router.route('/new').get(getNewTicket);
    this.router.route('/:id').get(getViewTicket);
  }
}

export default SupportTickets;
