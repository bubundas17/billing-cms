import { Router } from 'express';

import {
  getAllPosts,
  getCreateNewPost,
  postCreateNewPost,
  getEditPost,
  postDeletePost,
  postUpdatePost,
} from '../../controllers/admin';

class PostsRoute {
  constructor() {
    this.router = Router();
    this.baseUrl = '/admin/posts';
    this.init();
  }

  init() {
    this.router.get('/', getAllPosts);
    this.router.get('/new', getCreateNewPost);
    this.router.post('/new', postCreateNewPost);
    this.router.get('/:postId/edit', getEditPost);
    this.router.post('/:postId/edit', postUpdatePost);
    this.router.post('/delete', postDeletePost);
  }
}

export default PostsRoute;
