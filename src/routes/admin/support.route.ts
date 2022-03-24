import { ensureLoggedIn } from 'connect-ensure-login';

import BaseRoute from '@routes/base.route';
import {
  getNewTicket,
  getTickets,
  getViewTicket,
  postNewTicket,
  postReplyTicket,
  postCloseTicket,
} from '@controllers/admin/support.controller';
import { upload } from '@utils/uploader';

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
      .post(
        ensureLoggedIn({ redirectTo: '/auth/signin' }),
        upload.array('file'),
        postNewTicket,
      );

    this.router.post(
      '/close',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      postCloseTicket,
    );

    this.router.get(
      '/:id',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      getViewTicket,
    );

    this.router.post(
      '/:id/reply',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      upload.array('file'),
      postReplyTicket,
    );
  }
}

export default TicketRoute;
