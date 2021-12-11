import { Router } from 'express';
import passport from 'passport';

import validators from '../utils/validators.js';
import authControllers from '../controllers/auth.controller.js';
import { body, validationResult } from 'express-validator';

const router = Router();

router.get('/signup', authControllers.getSignUp);

router.post(
  '/signup',
  validators.registerValidator,
  authControllers.postSignUp,
);

router.get('/signin', authControllers.getSignIn);

router.post(
  '/signin',
  [
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
      .toLowerCase(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .bail()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .bail(),
  ],
  (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();
    const errorMessages = errors.array().reduce((obj, err) => {
      obj[err.param] = err.msg;
      return obj;
    }, {});

    res.render('auth/signin', {
      pageTitle: 'Sign Up',
      email,
      password,
      errorMessages,
    });
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/signin',
    failureFlash: true,
  }),
);

export default router;
