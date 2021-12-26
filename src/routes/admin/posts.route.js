import { Router } from 'express';
import { getAllPosts } from '../../controllers/admin';

class AppRoute {
  constructor() {
    this.router = Router();
    this.baseUrl = '/admin/posts';
    this.init();
  }

  init() {
    this.router.get('/', getAllPosts);
  }
}

export default AppRoute;
