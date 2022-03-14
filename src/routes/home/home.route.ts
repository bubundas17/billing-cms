import BaseRoute from '@routes/base.route';
import { getCurrency } from '@middlewares/currency.middleware';

class HomeRoute extends BaseRoute {
  constructor() {
    super('/');
    this.init();
  }

  init() {
    this.router.use(getCurrency);
    this.router.get('/', async (_req, res) => {
      // req.session.test = 'test';
      // res.title('Home Page');
      res.load('index', { data: 'Test Data', title: 'Home Page' });
    });
  }
}

export default HomeRoute;
