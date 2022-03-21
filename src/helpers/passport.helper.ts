import { Strategy as LocalStrategy } from 'passport-local';
import { ObjectId } from 'mongoose';
import { PassportStatic } from 'passport';

import UserModel from '@models/user.model';
import UserApi from '@core/api/users.api';

export default function (passport: PassportStatic) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (email, password, done) => {
        const e = 'Password or Username incorrect';

        try {
          const user = await UserModel.findOne({
            $or: [{ email }, { username: email }],
          }).lean();
          if (!user) return done(null, false, { message: e });

          const isPasswordValid = await UserApi.isValidPassword(
            password,
            user.password,
          );
          if (!isPasswordValid) return done(null, false, { message: e });

          done(null, user);
        } catch (error) {
          done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser(async (id: ObjectId, done) => {
    try {
      const user = await UserModel.findById(id).lean();

      if (!user) return done(null, false);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}
