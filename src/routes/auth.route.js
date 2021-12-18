import { Router } from 'express';

const router = Router();

router.get('/signup', async (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

export default router;
