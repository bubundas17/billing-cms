import { ensureLoggedIn } from 'connect-ensure-login';

import BaseRoute from '@routes/base.route';
import {
  getNewTicket,
  getTickets,
  getViewTicket,
  postNewTicket,
  postReplyTicket,
} from '@controllers/admin/support.controller';

class TicketRoute extends BaseRoute {
  constructor() {
    super('/admin/tickets');
    this.init();
  }

  init() {
    this.router.get(
      '/',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      getTickets,
    );

    this.router
      .route('/new')
      .get(ensureLoggedIn({ redirectTo: '/auth/signin' }), getNewTicket)
      .post(ensureLoggedIn({ redirectTo: '/auth/signin' }), postNewTicket);

    this.router.get(
      '/:id',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      getViewTicket,
    );

    this.router.post(
      '/:id/reply',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      postReplyTicket,
    );
  }
}

export default TicketRoute;