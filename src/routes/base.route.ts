import { Router } from 'express';

class BaseRoute {
  router: Router;

  constructor(public baseUrl: string) {
    this.router = Router();
    this.baseUrl = baseUrl;
  }
}

export default BaseRoute;
