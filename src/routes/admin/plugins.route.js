import {
  getIndex,
  enable,
  disable,
} from '@controllers/admin/plugins.controller';

import BaseRoute from '@routes/base.route';

class PluginRoute extends BaseRoute {
  constructor() {
    super('/admin/plugins');
    this.init();
  }

  init() {
    this.router.get('/', getIndex);
    this.router.get('/:pluginName/enable', enable);
    this.router.get('/:pluginName/disable', disable);
  }
}

export default PluginRoute;
