import BaseRoute from '@routes/base.route';

class HomeRoute extends BaseRoute {
  constructor() {
    super('/');
    this.init();
  }

  init() {
    this.router.get('/', async (req, res) => {
      // req.session.test = 'test';
      await req.getCurrency();
      res.load('index', { data: 'Test Data' });
    });
  }
}

export default HomeRoute;
