import { body } from 'express-validator';

import User from '../models/user.model.js';

export const registerValidator = [
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
      return true;
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .bail(),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('confirm password must be at least 6 characters long')
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('password not matched');
      return true;
    }),
];
