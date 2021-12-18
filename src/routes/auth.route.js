import { Router } from 'express';

const router = Router();

router.get('/signup', async (req, res) => {
  res.render('auth/signup');
});

export default router;
