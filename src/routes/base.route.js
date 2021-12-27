import { Router } from 'express';

class BaseRoute {
  constructor(baseUrl) {
    this.router = Router();
    this.baseUrl = baseUrl;
  }
}

export default BaseRoute;
