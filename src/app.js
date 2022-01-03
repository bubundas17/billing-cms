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
import flash from './helpers/flash.helper';

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

app.use('/assets', express.static(join(cwd(), 'assets')));
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

app.use(routes);

app.use(get4xx);
app.use(get5xx);

mongoose.connect(env.MONGO_URI).then(async () => {
  console.log('Connected to MongoDB');
  app.listen(env.PORT, async () => {
    console.log(`Server started on port ${env.PORT}`);
  });
});

// import express from 'express';
// import { create } from 'express-handlebars';
// import handlebars from 'handlebars';
// import { join } from 'path';
// import { cwd } from 'process';

// import util from './lib/theme';

// const app = express();

// const hbs = create({ extname: 'hbs', handlebars });

// app.engine('hbs', hbs.engine);
// app.set('view engine', 'hbs');
// app.set('views', join(cwd(), 'themes', 'enabled'));

// app.use(express.urlencoded({ extended: true }));

// import theme from './lib/theme';

// app.get('/', async (req, res) => {
//   const themes = await theme.allThemes();
//   res.render('index', { themes });
// });

// app.post('/enable-theme', async (req, res) => {
//   const { identifier } = req.body;

//   try {
//     await util.themeEnabler(identifier);
//     res.redirect('/');
//   } catch (error) {
//     console.error(error);
//     res.send(error.message);
//   }
// });

// app.listen(3000, () => {
//   console.log('listening on port 3000');
// });
