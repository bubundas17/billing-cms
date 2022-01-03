import { getIndex } from '@controllers/admin/plugins.controller';
import BaseRoute from '@routes/base.route';

class PluginRoute extends BaseRoute {
  constructor() {
    super('/admin/plugins');
    this.init();
  }

  init() {
    this.router.get('/', getIndex);
  }
}

export default PluginRoute;
