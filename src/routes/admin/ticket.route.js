import BaseRoute from '@routes/base.route';

class TicketRoute extends BaseRoute {
  constructor() {
    super('/ticket');
    this.init();
  }

  init() {
    this.router.get('/', (req, res) => {
      res.send('Hello World!');
    });
  }
}

export default TicketRoute;
