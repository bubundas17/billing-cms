import { ensureLoggedIn, ensureLoggedOut } from 'connect-ensure-login';

import {
  getSignIn,
  getSignUp,
  getSignOut,
  getResetPassword,
  postSignUp,
  postSignIn,
  postResetPassword,
} from '@controllers/index';
import BaseRoute from '@routes/base.route';

class AuthRoute extends BaseRoute {
  constructor() {
    super('/auth');
    this.init();
  }

  init() {
    this.router.get('/signup', ensureLoggedOut({ redirectTo: '/' }), getSignUp);

    this.router.get('/signin', ensureLoggedOut({ redirectTo: '/' }), getSignIn);

    this.router.get(
      '/reset-password',
      ensureLoggedOut({ redirectTo: '/' }),
      getResetPassword,
    );

    this.router.post('/reset-password', postResetPassword);

    this.router.post(
      '/signup',
      ensureLoggedOut({ redirectTo: '/' }),
      postSignUp,
    );

    this.router.post(
      '/signin',
      ensureLoggedOut({ redirectTo: '/' }),
      postSignIn,
    );

    this.router.get(
      '/signout',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      getSignOut,
    );
  }
}

export default AuthRoute;
