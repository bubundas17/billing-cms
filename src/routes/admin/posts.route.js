import { Router } from 'express';
import { getAllPosts, getNewPost, addPost, editPost } from '../../controllers/admin';

class PostsRoute {
  constructor() {
    this.router = Router();
    this.baseUrl = '/admin/posts';
    this.init();
  }

  init() {
    this.router.get('/', getAllPosts)
    this.router.get('/new', getNewPost)
    this.router.post('/', addPost)
    this.router.get('/:postId', editPost)
  }
}

export default PostsRoute;
