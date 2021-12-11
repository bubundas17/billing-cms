import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import createError from 'http-errors';
import session from 'express-session';
import flash from 'connect-flash';
import { join } from 'desm';

import env from './configs/env.config.js';
import authRoute from './routes/auth.route.js';

const app = express();
const port = env.PORT;

app.set('view engine', 'ejs');
app.set('views', join(import.meta.url, 'views'));

if (env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(join(import.meta.url, 'public')));
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use('/auth', authRoute);

app.use((_req, _res, next) => {
  const error = new createError.NotFound();
  next(error);
});

app.use((error, _req, res, _next) => {
  if (!error.statusCode) error.statusCode = 500;
  if (!error.message) error.message = 'Something went wrong';
  res
    .status(error.statusCode)
    .render('error', { error, pageTitle: error.message });
});

app.listen(port, async () => {
  console.log(`App listening on port ${port}`);

  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('Database connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
