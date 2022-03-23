import { getCart } from '@controllers/cart/index.controller';
import BaseRoute from '@routes/base.route';

class CartRoute extends BaseRoute {
  constructor() {
    super('/cart');
    this.init();
  }

  init() {
    this.router.route('/').get(getCart);
  }
}

export default CartRoute;
