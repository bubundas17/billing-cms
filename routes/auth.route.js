import { Router } from 'express';

import validators from '../utils/validators.js';
import authControllers from '../controllers/auth.controller.js';

const router = Router();

router.get('/signup', authControllers.getSignUp);

router.post(
  '/signup',
  validators.registerValidator,
  authControllers.postSignUp,
);

router.get('/signin', authControllers.getSignIn);

router.post('/signin', async (req, res, next) => {
  try {
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

export default router;
