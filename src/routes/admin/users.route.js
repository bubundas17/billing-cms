import { getClients, getClientDetails } from '@controllers';
import BaseRoute from '@routes/base.route';

class ClientsRoute extends BaseRoute {
  constructor() {
    super('/admin/users');
    this.init();
  }

  init() {
    this.router.get('/', getClients);
    this.router.get('/details', getClientDetails);
  }
}

export default ClientsRoute;
