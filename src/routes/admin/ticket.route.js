import BaseRoute from '../base.route';

class TicketRoute extends BaseRoute {
  constructor() {
    super('/ticket');
    this.init();
  }

  init() {
    this.router.get(this.baseUrl, (req, res) => {
      res.send('Hello World!');
    });
  }
}

export default TicketRoute;
