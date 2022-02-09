import passport from 'passport';
import { ensureLoggedIn, ensureLoggedOut } from 'connect-ensure-login';

import {
  getSignIn,
  getSignUp,
  getSignOut,
  getResetPassword,
  postSignIn,
  postSignUp,
} from '@controllers/index';
import { signUpValidator, signInValidator } from '@utils/validator';
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

    this.router.post(
      '/signup',
      ensureLoggedOut({ redirectTo: '/' }),
      signUpValidator,
      postSignUp,
    );

    this.router.post(
      '/signin',
      ensureLoggedOut({ redirectTo: '/' }),
      signInValidator,
      postSignIn,
      passport.authenticate('local', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/auth/signin',
        failureFlash: true,
      }),
    );

    this.router.get(
      '/signout',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      getSignOut,
    );
  }
}

export default AuthRoute;