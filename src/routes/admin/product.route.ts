import BaseRoute from '@routes/base.route';
import {
  getAllProducts,
  postAddProduct,
  getAddProduct,
  getEditProduct,
  postEditProduct,
  deleteProduct,
  getAddGroup,
  postAddGroup,
} from '@controllers/admin/product.controller';

class PostsRoute extends BaseRoute {
  constructor() {
    super('/admin/products');
    this.init();
  }

  init() {
    this.router.route('/').get(getAllProducts);
    this.router.route('/delete').post(deleteProduct);
    this.router.route('/new').get(getAddProduct).post(postAddProduct);
    this.router.route('/:id').get(getEditProduct).post(postEditProduct);
    this.router.route('/groups/new').get(getAddGroup).post(postAddGroup);
  }
}

export default PostsRoute;
