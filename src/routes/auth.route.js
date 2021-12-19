import { Router } from 'express';
import passport from 'passport';

import {
  getSignIn,
  getSignUp,
  postSignIn,
  postSignUp,
} from '../controllers/auth.controller';
import { signUpValidator, signInValidator } from '../utils/validator';

const router = Router();

router.get('/signup', getSignUp);

router.get('/signin', getSignIn);

router.post('/signup', signUpValidator, postSignUp);

router.post(
  '/signin',
  signInValidator,
  postSignIn,
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/signin',
    failureFlash: true,
  }),
);

export default router;
