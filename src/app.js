import { join } from 'path';
import { cwd, exit } from 'process';

import express from 'express';
import mongoose from 'mongoose';
import Handlebars from 'handlebars';
import { create } from 'express-handlebars';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';

import env from './configs/env.config';
import routes from './routes';
import { get4xx, get5xx } from './controllers';
import handlebarsHelpers from './helpers/handlebars-helpers';
import passportHelper from './helpers/passport.helper';
import { flash } from './helpers/flash.helper';

const hbs = create({
  extname: 'hbs',
  handlebars: Handlebars,
  defaultLayout: 'main',
  helpers: handlebarsHelpers,
});

const app = express();

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', join(cwd(), 'views'));

app.use('/public', express.static(join(cwd(), 'public')));
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

app.use(passport.initialize());
app.use(passport.session());
passportHelper(passport);

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.get('/', (_req, res) => {
  res.render('index', {
    pathName: 'home',
  });
});

app.use(routes);

app.use(get4xx);
app.use(get5xx);

app.listen(env.PORT, async () => {
  console.log(`Server started on port ${env.PORT}`);

  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('Database connected');
  } catch (error) {
    console.error(error);
    exit(1);
  }
});
