import { Router } from 'express';

const router = Router();

router.get('/signup', async (_req, res) => {
  res.render('auth/signup', {
    pageTitle: 'Sign Up',
  });
});

router.get('/signin', async (_req, res) => {
  res.render('auth/signin', {
    pageTitle: 'Sign In',
  });
});

export default router;
