import { Router } from 'express';
import { ensureLoggedIn } from 'connect-ensure-login';

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
    this.router.get(
      '/',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      getAllPosts,
    );

    this.router.get(
      '/new',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      getCreateNewPost,
    );

    this.router.post(
      '/new',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      postCreateNewPost,
    );

    this.router.get(
      '/:postId/edit',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      getEditPost,
    );

    this.router.post(
      '/:postId/edit',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      postUpdatePost,
    );

    this.router.post(
      '/delete',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      postDeletePost,
    );
  }
}

export default PostsRoute;
