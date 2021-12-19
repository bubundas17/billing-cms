import { Router } from 'express';
import passport from 'passport';

import { getSignIn, getSignUp, postSignIn, postSignUp } from '../controllers';
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

router.get('/signout', (req, res) => {
  req.logout();
  res.redirect('/auth/signin');
});

export default router;
