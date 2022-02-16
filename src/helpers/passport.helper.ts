import { Strategy as LocalStrategy } from 'passport-local';
import { ObjectId } from 'mongoose';
import { PassportStatic } from 'passport';

import UserModel from '@models/user.model';

export default function (passport: PassportStatic) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        const e = 'Password or Username incorrect';

        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            req.flash('error', e);
            return done(null, false);
          }
          const isValidPassword = await user.isValidPassword(password);
          console.log('isValidPassword', isValidPassword);

          if (!isValidPassword) {
            req.flash('error', e);
            return done(null, false);
          }
          done(null, user);
        } catch (error) {
          done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id: ObjectId, done) => {
    try {
      const user = await UserModel.findById(id);

      if (!user) return done(null, false);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}
