import { validationResult } from 'express-validator';

 // @ts-ignore
import User from '@models/user.model';
 // @ts-ignore
import mappedErrors from '@utils/mapped-errors';
 // @ts-ignore
import pluginDriver from '@lib/plugin-driver';

/**
 * @description Render the sign up page
 *
 * @param {object} req
 * @param {object} res
 */
export const getSignUp = (req, res) => {
  res.render('auth/signup', {
    pathName: 'signup',
    layout: 'auth',
  });
};

/**
 * @description Render the sign in page
 *
 * @param {object} req
 * @param {object} res
 */
export const getSignIn = (req, res) => {
  res.render('auth/signin', {
    pathName: 'signin',
    layout: 'auth',
  });
};

/**
 * @description Render the sign in page
 *
 * @param {object} req
 * @param {object} res
 */
export const getResetPassword = (req, res) => {
  res.render('auth/reset-password', {
    pathName: 'reset-password',
    layout: 'auth',
  });
};

/**
 * @description Sign up a new user
 *
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 * @returns {Promise}
 */
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
        pathName: 'signup',
        layout: 'auth',
      });
    }

    const user = new User({ name, email, password, address });
    await user.save();
    res.redirect('/auth/signin');
  } catch (error) {
    next(error);
  }
};

/**
 * @description Sign in a user
 *
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
export const postSignIn = async (req, res, next) => {
  const { email, password } = req.body;

  console.log(email, password);

  const errors = validationResult(req);
  await pluginDriver.executeHook('onSignIn', { email, password });
  if (errors.isEmpty()) return next();
  pluginDriver.executeHook('onSignInError', errors);
  return res.render('auth/signin', {
    pathName: 'signin',
    email,
    password,
    errors: mappedErrors(errors.array()),
    layout: 'auth',
  });
};

/**
 * @description Sign out a signed in user
 *
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
export const getSignOut = (req, res) => {
  req.logout();
  res.redirect('/auth/signin');
};
