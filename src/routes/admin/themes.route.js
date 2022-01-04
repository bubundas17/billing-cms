import {
  getIndex,
  postEnableTheme,
  postDeleteTheme,
} from '@controllers/admin/themes.controller';
import BaseRoute from '@routes/base.route';

class ThemeRoute extends BaseRoute {
  constructor() {
    super('/admin/themes');
    this.init();
  }

  init() {
    this.router.get('/', getIndex);
    this.router.post('/enable', postEnableTheme);
    this.router.post('/remove', postDeleteTheme);
  }
}

export default ThemeRoute;
