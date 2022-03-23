import { ensureLoggedIn } from 'connect-ensure-login';

import {
  getNewTicket,
  getTickets,
  getViewTicket,
  postNewTicket,
  postReplyTicket,
} from '@controllers/clientarea/support.controller';
import BaseRoute from '@routes/base.route';

class SupportTickets extends BaseRoute {
  constructor() {
    super('/clientarea/tickets');
    this.init();
  }

  init() {
    this.router
      .route('/')
      .get(ensureLoggedIn({ redirectTo: '/auth/signin' }), getTickets);

    this.router.route('/new').get(getNewTicket).post(postNewTicket);

    this.router
      .route('/:id')
      .get(ensureLoggedIn({ redirectTo: '/auth/signin' }), getViewTicket);

    this.router.post(
      '/:id/reply',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      postReplyTicket,
    );
  }
}

export default SupportTickets;
