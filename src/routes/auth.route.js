import { Router } from 'express';

import User from '../models/user.model';
import { registerValidator } from '../utils/validator';

const router = Router();

router.get('/signup', async (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', registerValidator, async (req, res, next) => {
  const { name, email, password, address } = req.body;

  try {
    const user = new User({ name, email, password, address });
    await user.save();
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

export default router;
