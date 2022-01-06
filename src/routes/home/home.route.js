import BaseRoute from '@routes/base.route';

class HomeRoute extends BaseRoute {
  constructor() {
    super('/');
    this.init();
  }
  init() {
    this.router.get('/', (req, res) => {
      res.load('index');
    });
  }
}

export default HomeRoute;
