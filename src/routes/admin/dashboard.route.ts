import { ensureLoggedIn } from 'connect-ensure-login';

import { getDashboard } from '@controllers/index';
import BaseRoute from '@routes/base.route';

class DashboardRoute extends BaseRoute {
  constructor() {
    super('/admin/dashboard');
    this.init();
  }

  init() {
    this.router.get(
      '/',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      getDashboard,
    );
  }
}

export default DashboardRoute;
