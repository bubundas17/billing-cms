import 'module-alias/register';
import 'reflect-metadata';
import { join } from 'path';
import express from 'express';
import { connect } from 'mongoose';
import Handlebars from 'handlebars';
import { create } from 'express-handlebars';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';

import env from '@configs/env.config';
import routes from '@routes/index';
import { get4xx, get5xx } from '@controllers/index';
import handlebarsHelpers from '@helpers/handlebars-helpers';
import passportHelper from '@helpers/passport.helper';
import flash from '@helpers/flash.helper';
import theme from '@lib/theme';

import emailSender from '@services/email.sender.service';

// TODO - Add proper error handling and logging to the console
// TODO - Reduce the amount of code in this file
// TODO - Create perfect theme.registerThemeEngine method that will register a theme engine, you can use app.set to register the engine

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

app.use('/assets', express.static(join(__dirname, 'assets')));
app.use(express.json());
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

app.use(routes);

const bootstrap = async () => {
  try {
    await connect(env.MONGO_URI);
    console.log('Connected to MongoDB');

    app.listen(env.PORT, () =>
      console.log(`Server started on port ${env.PORT}`),
    );
    // Process Email Queue
    emailSender.processEmails();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

bootstrap();
