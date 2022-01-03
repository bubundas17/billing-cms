import BaseRoute from '@routes/base.route';

class HomeRoute extends BaseRoute {
  constructor() {
    super('/');
    this.init();
  }

  init() {
    /**
     * @description Render home page
     *
     * @param {object} req
     * @param {object} res
     */
    this.router.get('/', (req, res) => {
      res.render('index', {
        pathName: 'home',
      });
    });
  }
}

export default HomeRoute;
