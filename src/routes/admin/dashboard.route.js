import { getDashboard } from '../../controllers/admin';
import BaseRoute from '../base.route';

class DashboardRoute extends BaseRoute {
  constructor() {
    super('/admin/dashboard');
    this.init();
  }

  init() {
    this.router.get('/', getDashboard);
  }
}

export default DashboardRoute;
