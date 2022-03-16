import BaseRoute from '@routes/base.route';

class TicketRoute extends BaseRoute {
  constructor() {
    super('/admin/ticket');
    this.init();
  }

  init() {
    this.router.get('/', (_req, res) => {
      res.render('admin/tickets', {
        tickets: [
          {
            id: 1,
            title: 'Ticket #1',
            description: 'Ticket 1 description',
            status: 'Open',
            labels: ['bug', 'enhancement'],
            icon: 'fa-ticket',
          },
          {
            id: 2,
            title: 'Ticket #2',
            description: 'Ticket 2 description',
            status: 'Open',
            labels: ['bug', 'enhancement'],
            icon: 'fa-ticket',
          },
          {
            id: 3,
            title: 'Ticket #3',
            description: 'Ticket 3 description',
            status: 'Open',
            labels: ['bug', 'enhancement'],
            icon: 'fa-ticket',
          },
        ],
      });
    });
  }
}

export default TicketRoute;
