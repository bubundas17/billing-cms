import { ensureLoggedIn } from 'connect-ensure-login';

import {
  getNewTicket,
  getTickets,
  getViewTicket,
  postNewTicket,
  postReplyTicket,
} from '@controllers/clientarea/support.controller';
import BaseRoute from '@routes/base.route';
import { upload } from '@utils/uploader';

class SupportTickets extends BaseRoute {
  constructor() {
    super('/clientarea/tickets');
    this.init();
  }

  init() {
    this.router
      .route('/')
      .get(ensureLoggedIn({ redirectTo: '/auth/signin' }), getTickets);

    this.router
      .route('/new')
      .get(getNewTicket)
      .post(upload.array('file'), postNewTicket);

    this.router
      .route('/:id')
      .get(ensureLoggedIn({ redirectTo: '/auth/signin' }), getViewTicket);

    this.router.post(
      '/:id/reply',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      upload.array('file'),
      postReplyTicket,
    );
  }
}

export default SupportTickets;
