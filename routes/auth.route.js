import { Router } from 'express';
import { body, validationResult } from 'express-validator';

import User from '../models/user.model.js';

const router = Router();

router.get('/signup', async (_req, res) => {
  res.render('auth/signup', {
    pageTitle: 'Sign Up',
  });
});

router.post(
  '/signup',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .bail()
      .isLength({ min: 3 })
      .withMessage('Name must be at least 3 characters long')
      .bail(),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .bail()
      .isLength({ min: 5 })
      .withMessage('Email must be at least 5 characters long')
      .bail()
      .isEmail()
      .withMessage('Email is invalid')
      .bail()
      .normalizeEmail()
      .toLowerCase()
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) throw new Error('Email already exists');
      }),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .bail()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .bail(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('password not matched');
      return true;
    }),
  ],
  async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
          req.flash('error', error.msg);
        });
        return res.render('auth/signup', {
          pageTitle: 'Sign Up',
          name,
          email,
        });
      }
      const user = new User({ name, email, password });
      await user.save();
      res.redirect('/auth/signin');
    } catch (error) {
      next(error);
    }
  },
);

router.get('/signin', async (_req, res) => {
  res.render('auth/signin', {
    pageTitle: 'Sign In',
  });
});

export default router;
