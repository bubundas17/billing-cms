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
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user)
            return done(null, false, {
              message: `User with email ${email} not found.`,
            });
          const isValidPassword = await user.isValidPassword(password);
          if (!isValidPassword)
            return done(null, false, { message: 'Incorrect password.' });
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
