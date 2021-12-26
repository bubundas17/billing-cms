import { Router } from 'express';
import passport from 'passport';

import {
  getSignIn,
  getSignUp,
  postSignIn,
  postSignUp,
} from '../../controllers';
import { signUpValidator, signInValidator } from '../../utils/validator';

class AuthRoute {
  constructor() {
    this.router = Router();
    this.baseUrl = '/auth';
    this.init();
  }
  init() {
    this.router.get(`/signup`, getSignUp);
    this.router.get(`/signin`, getSignIn);
    this.router.post(`/signup`, signUpValidator, postSignUp);
    this.router.post(
      `/signin`,
      signInValidator,
      postSignIn,
      passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/signin',
        failureFlash: true,
      }),
    );
    this.router.post(`/signout`, (req, res) => {
      req.logout();
      res.redirect('/auth/signin');
    });
  }
}

export default AuthRoute;
