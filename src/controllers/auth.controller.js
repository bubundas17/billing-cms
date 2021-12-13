import { validationResult } from 'express-validator';
import createError from 'http-errors';

import User from '../models/user.model.js';

const authControllers = {
  getSignUp: (_req, res) => {
    res.render('auth/signup', {
      pageTitle: 'Sign Up',
    });
  },
  postSignUp: async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().reduce((obj, err) => {
          obj[err.param] = err.msg;
          return obj;
        }, {});
        return res.render('auth/signup', {
          pageTitle: 'Sign Up',
          name,
          email,
          password,
          errorMessages,
        });
      }
      const user = new User({ name, email, password });
      const savedUser = await user.save();
      if (!savedUser) throw createError.InternalServerError('User not saved');
      req.flash(
        'success',
        `${savedUser.name} successfully signed up, please login`,
      );
      res.redirect('/auth/signin');
    } catch (error) {
      next(error);
    }
  },
  getSignIn: async (_req, res) => {
    res.render('auth/signin', {
      pageTitle: 'Sign In',
    });
  },
};

export default authControllers;
