import {
  getClients,
  getClientProfile,
  getClientSummary,
  getEditProfile,
} from '@controllers/index';
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
    this.router.get('/:id', getEditProfile);
  }
}

export default ClientsRoute;
