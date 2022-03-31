import ProductApi from '@core/api/product.api';
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

    this.router.route('/products/:slug/configure').get((_req, res) => {
      res.title('Config Product');
      res.load('store/configure-product');
    });

    this.router.route('/:slug').get(async (req, res) => {
      const productGroup = await ProductApi.getProductGroupById(
        req.params.slug,
      );
      const products = await ProductApi.getAllProductsByGroup(req.params.slug);

      res.title('Store');
      res.load('store/archive-category', { productGroup, products });
    });
  }
}

export default StoreRoute;
