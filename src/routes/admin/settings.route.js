import BaseRoute from '@routes/base.route';
import {
  getIndex,
  getGeneralSettings,
  postGeneralSettings,
  postEmailSettings,
  getEmailSettings,
} from '@controllers/admin/settings.controller';
class SettingsRoute extends BaseRoute {
  constructor() {
    super('/admin/settings');
    this.init();
  }

  init() {
    this.router.get('/', getIndex);
    // general settings
    this.router.get('/general', getGeneralSettings);
    this.router.post('/general', postGeneralSettings);
    // email settings
    this.router.get('/email', getEmailSettings);
    this.router.post('/email', postEmailSettings);
  }
}

export default SettingsRoute;
