import {
  getClients,
  getClientProfile,
  getClientSummary,
  getEditProfile,
  getUserSearch,
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
    this.router.get('/profile/edit/:id', getEditProfile);
    this.router.get('/search', getUserSearch);
    this.router.get('/summary', getClientSummary);
  }
}

export default ClientsRoute;
