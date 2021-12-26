import { Router } from 'express';

class TicketRoute {
  constructor() {
    this.router = Router();
    this.baseUrl = '/ticket';
    this.init();
  }

  init() {
    this.router.get(this.baseUrl, (req, res) => {
      res.send('Hello World!');
    });
  }
}

export default TicketRoute;
