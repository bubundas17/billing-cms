import BaseRoute from '@routes/base.route';
import {
  getIndex,
  getGeneralSettings,
  postGeneralSettings,
} from '@controllers/admin/settings.controller';
class SettingsRoute extends BaseRoute {
  constructor() {
    super('/admin/settings');
    this.init();
  }

  init() {
    this.router.get('/', getIndex);
    this.router.get('/general', getGeneralSettings);
    this.router.post('/general', postGeneralSettings);
  }
}

export default SettingsRoute;
