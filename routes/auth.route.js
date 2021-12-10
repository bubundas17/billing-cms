import { Router } from 'express';

const router = Router();

router.get('/register', async (_req, res) => {
  res.render('auth/register');
});

export default router;
