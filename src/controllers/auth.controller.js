import { validationResult } from 'express-validator';

import User from '../models/user.model';
import { mappedErrors } from '../utils/mapped-errors';

export const getSignUp = (req, res) => {
  res.render('auth/signup', {
    pathName: 'signup',
  });
};

export const getSignIn = (req, res) => {
  res.render('auth/signin', {
    pathName: 'signin',
  });
};

export const postSignUp = async (req, res, next) => {
  const { name, email, address, password, confirmPassword } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/signup', {
        name,
        email,
        address,
        password,
        confirmPassword,
        errors: mappedErrors(errors.array()),
      });
    }

    const user = new User({ name, email, password, address });
    await user.save();
    res.redirect('/auth/signin');
  } catch (error) {
    next(error);
  }
};

export const postSignIn = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  res.render('auth/signin', {
    pathName: 'Sign Up',
    email,
    password,
    errors: mappedErrors(errors.array()),
  });
};
