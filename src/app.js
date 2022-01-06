import { join } from 'path';

import express from 'express';
import mongoose from 'mongoose';
import Handlebars from 'handlebars';
import { create } from 'express-handlebars';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import sassMiddleware from 'node-sass-middleware';

import env from '@configs/env.config';
import routes from '@routes';
import { get4xx, get5xx } from '@controllers';
import handlebarsHelpers from '@helpers/handlebars-helpers';
import passportHelper from '@helpers/passport.helper';
import flash from '@helpers/flash.helper';
import { cwd } from 'process';
import { compile } from 'handlebars';

import theme from '@lib/theme';
// theme.save();

const hbs = create({
  extname: 'hbs',
  handlebars: Handlebars,
  defaultLayout: 'main',
  helpers: handlebarsHelpers,
});

const app = express();

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'views'));

// sassMiddleware
if (env.NODE_ENV === 'development') {
  app.use(
    sassMiddleware({
      src: join(__dirname, 'assets', 'scss'),
      dest: join(__dirname, 'assets', 'css'),
      debug: false,
      outputStyle: 'compressed',
      prefix: '/assets/css/',
    }),
  );
}

app.use('/assets', express.static(join(__dirname, 'assets')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: env.SESSION_SECRET,
    store: new MongoStore({
      mongoUrl: env.MONGO_URI,
    }),
  }),
);

app.use(flash);
if (env.NODE_ENV === 'development') app.use(morgan('dev'));

theme.registerThemeEngine(app).then(() => {
  app.use(get4xx);
  app.use(get5xx);
});

app.use(passport.initialize());
app.use(passport.session());
passportHelper(passport);

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// app.use();

app.use(routes);

mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(env.PORT, () =>
      console.log(`Server started on port ${env.PORT}`),
    );
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
