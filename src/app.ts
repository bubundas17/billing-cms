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
import flash from 'connect-flash';

import env from '@configs/env.config';
import routes from '@routes/index';
import { get4xx, get5xx } from '@controllers/index';
import handlebarsHelpers from '@helpers/handlebars-helpers';
import passportHelper from '@helpers/passport.helper';
import theme from '@lib/theme';

import emailSender from '@services/email.sender.service';
import emailDriver, { EmailConfig } from '@lib/email-driver';

// TODO - Add proper error handling and logging to the console
// TODO - Reduce the amount of code in this file
// TODO - Create perfect theme.registerThemeEngine method that will register a theme engine, you can use app.set to register the engine

class App {
  private hbs = create({
    extname: 'hbs',
    handlebars: Handlebars,
    defaultLayout: 'main',
    helpers: handlebarsHelpers,
  });

  constructor(private app = express()) {
    this.initialize();
  }

  private async initialize() {
    await this.connectToDB();
    this.listen();
    this.setViewEngine();
    await this.initializeMiddlewares();
  }

  private async initializeMiddlewares() {
    this.app.use('/assets', express.static(join(__dirname, 'assets')));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(
      session({
        resave: false,
        saveUninitialized: false,
        secret: env.SESSION_SECRET,
        store: new MongoStore({
          mongoUrl: env.MONGO_URI,
        }),
      }),
    );

    this.app.use(flash());
    if (env.NODE_ENV === 'development') this.app.use(morgan('dev'));

    this.app.use(passport.initialize());
    this.app.use(passport.session());
    passportHelper(passport);

    await theme.registerThemeEngine(this.app);

    this.app.use((req, res, next) => {
      res.locals.user = req.user;
      res.locals.isAuthenticated = req.isAuthenticated();
      next();
    });

    this.app.use(routes);
    this.app.use(get4xx);
    this.app.use(get5xx);
  }

  private setViewEngine() {
    this.app.engine('hbs', this.hbs.engine);
    this.app.set('view engine', 'hbs');
    this.app.set('views', join(__dirname, 'views'));
  }

  private async connectToDB() {
    await connect(env.MONGO_URI);
    console.log('Connected to Database');
  }

  private listen() {
    this.app.listen(env.PORT, () =>
      console.log(`App started on port ${env.PORT}`),
    );
    emailSender.init();
    emailDriver.init({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USERNAME,
        pass: env.SMTP_PASSWORD,
      },
    } as EmailConfig);
    emailSender.processEmails();
  }
}

new App();
