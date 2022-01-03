import { getIndex } from '../../controllers/admin/themes.controller';

import BaseRoute from '../base.route';

class ThemeRoute extends BaseRoute {
  constructor() {
    super('/admin/themes');
    this.init();
  }

  init() {
    this.router.get('/', getIndex);
  }
}

export default ThemeRoute;
