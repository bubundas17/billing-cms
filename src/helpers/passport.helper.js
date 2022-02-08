import { Strategy as LocalStrategy } from 'passport-local';

import User from '@models/user.model';

export default function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
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

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) return done(null, false);
      const { password, ...rest } = user._doc;
      done(null, rest);
    } catch (error) {
      done(error);
    }
  });
}
