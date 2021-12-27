import { Router } from 'express';

/*
 * The base route class for all routes
 * It must have a baseUrl and a router property
 */
class BaseRoute {
  constructor() {
    this.router = Router();
    this.baseUrl = '/posts';
    this.init();
  }

  init() {
    /**
     * @description Send Hello World
     *
     * @param {object} req
     * @param {object} res
     */
    this.router.get('/', (req, res) => {
      res.send('Hello World!');
    });
  }
}

export default BaseRoute;
