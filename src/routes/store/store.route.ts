import BaseRoute from '@routes/base.route';

class StoreRoute extends BaseRoute {
  constructor() {
    super('/store');
    this.init();
  }

  init() {
    this.router.route('/').get((_req, res) => {
      res.title('Store');
      res.load('store/index');
    });

    // this.router.route('/:id').get((req, res) => {
    this.router.route('/:slug').get((_req, res) => {
      res.title('Store');
      res.load('store/archive-category.hbs');
    });
  }
}

export default StoreRoute;
