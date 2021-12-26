import { Router } from 'express';
import { getAllPosts } from '../../controllers/admin';

class PostsRoute {
  constructor() {
    this.router = Router();
    this.baseUrl = '/admin/posts';
    this.init();
  }

  init() {
    this.router.get('/', getAllPosts);
  }
}

export default PostsRoute;
