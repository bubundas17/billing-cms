import { Router } from 'express';

import { getDashboard } from '../../controllers/admin';

class DashboardRoute {
  constructor() {
    this.router = Router();
    this.baseUrl = '/admin/dashboard';
    this.init();
  }

  init() {
    this.router.get('/', getDashboard);
  }
}

export default DashboardRoute;
