import { Router } from 'express';

class AppRoute {
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

export default AppRoute;
