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
    // Product configuration
    this.router.route('/products/:slug/configure').get((_req, res) => {
      res.title('Config Product');
      res.load('store/configure-product');
    });

    // this.router.route('/:id').get((req, res) => {
    this.router.route('/:slug').get((_req, res) => {
      res.title('Store');
      res.load('store/archive-category');
    });
  }
}

export default StoreRoute;
