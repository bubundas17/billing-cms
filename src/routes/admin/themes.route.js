import {
  getIndex,
  getEnableTheme,
  getDeleteTheme,
} from '@controllers/admin/themes.controller';
import BaseRoute from '@routes/base.route';

class ThemeRoute extends BaseRoute {
  constructor() {
    super('/admin/themes');
    this.init();
  }

  init() {
    this.router.get('/', getIndex);
    this.router.get('/:themeName/enable', getEnableTheme);
    this.router.get('/:themeName/remove', getDeleteTheme);
  }
}

export default ThemeRoute;
