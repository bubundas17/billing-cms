import { getClients } from '@controllers';
import BaseRoute from '@routes/base.route';

class ClientsRoute extends BaseRoute {
  constructor() {
    super('/admin/clients');
    this.init();
  }

  init() {
    this.router.get('/', getClients);
  }
}

export default ClientsRoute;
