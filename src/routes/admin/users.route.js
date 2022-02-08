import { getClients, getClientProfile, getClientSummary } from '@controllers';
import BaseRoute from '@routes/base.route';

class ClientsRoute extends BaseRoute {
  constructor() {
    super('/admin/users');
    this.init();
  }

  init() {
    this.router.get('/', getClients);
    this.router.get('/profile', getClientProfile);
    this.router.get('/summary', getClientSummary);
  }
}

export default ClientsRoute;
