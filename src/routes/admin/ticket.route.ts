import TicketModel from '@models/ticket.model';
import BaseRoute from '@routes/base.route';
import { ensureLoggedIn } from 'connect-ensure-login';

class TicketRoute extends BaseRoute {
  constructor() {
    super('/tickets');
    this.init();
  }

  init() {
    this.router.get('/', async (_req, res) => {
      const tickets = await TicketModel.find().lean();
      console.log(tickets);

      res.render('admin/tickets', {
        tickets,
      });
    });

    this.router.get('/new-ticket', (_req, res) => {
      res.render('admin/tickets/new-ticket');
    });

    this.router.post(
      '/new-ticket',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      async (req, res) => {
        try {
          const ticket = new TicketModel({
            ...req.body,
            createdBy: res.locals.user,
          });
          await ticket.save();

          req.flash('success', 'Ticket created successfully');
          res.redirect('/tickets');
        } catch (error) {
          req.flash('error', 'Error creating ticket');
          res.render('admin/tickets/new-ticket', {
            ticket: req.body,
            _errors: req.flash('error'),
          });
        }
      },
    );
  }
}

export default TicketRoute;
