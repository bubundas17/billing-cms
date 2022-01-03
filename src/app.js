// import { join } from 'path';
// import { cwd, exit } from 'process';

// import express from 'express';
// import mongoose from 'mongoose';
// import Handlebars from 'handlebars';
// import { create } from 'express-handlebars';
// import morgan from 'morgan';
// import session from 'express-session';
// import passport from 'passport';
// import MongoStore from 'connect-mongo';
// import cookieParser from 'cookie-parser';

// import env from './configs/env.config';
// import routes from './routes';
// import { get4xx, get5xx } from './controllers';
// import handlebarsHelpers from './helpers/handlebars-helpers';
// import passportHelper from './helpers/passport.helper';
// import flash from './helpers/flash.helper';

// const hbs = create({
//   extname: 'hbs',
//   handlebars: Handlebars,
//   defaultLayout: 'main',
//   helpers: handlebarsHelpers,
// });

// const app = express();

// app.engine('hbs', hbs.engine);
// app.set('view engine', 'hbs');
// app.set('views', join(cwd(), 'views'));

// app.use('/public', express.static(join(cwd(), 'public')));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(
//   session({
//     resave: false,
//     saveUninitialized: false,
//     secret: env.SESSION_SECRET,
//     store: new MongoStore({
//       mongoUrl: env.MONGO_URI,
//     }),
//   }),
// );

// app.use(flash);
// if (env.NODE_ENV === 'development') app.use(morgan('dev'));

// app.use(passport.initialize());
// app.use(passport.session());
// passportHelper(passport);

// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   res.locals.isAuthenticated = req.isAuthenticated();
//   next();
// });

// app.use(routes);

// app.use(get4xx);
// app.use(get5xx);

// app.listen(env.PORT, async () => {
//   console.log(`Server started on port ${env.PORT}`);

//   try {
//     await mongoose.connect(env.MONGO_URI);
//     console.log('Database connected');
//   } catch (error) {
//     console.error(error);
//     exit(1);
//   }
// });

import express from 'express';
import { create } from 'express-handlebars';
import handlebars from 'handlebars';
import { join } from 'path';
import { cwd } from 'process';
import { readFile, readdir, lstat } from 'fs/promises';

import util from './lib/theme';

const app = express();

const hbs = create({ extname: 'hbs', handlebars });

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', join(cwd(), 'themes', 'enabled'));

app.use(express.urlencoded({ extended: true }));

const test = async () => {
  const baseThemeDir = join(cwd(), 'themes');
  const enabledThemePath = join(baseThemeDir, 'enabled');
  const disabledThemesPath = join(baseThemeDir, 'disabled');

  const themes = {
    enabled: {},
    disabled: [],
  };

  try {
    try {
      const enabledTheme = await readdir(enabledThemePath);
      const enabledThemeJsonIndex = enabledTheme.indexOf('theme.json');
      if (enabledThemeJsonIndex === -1)
        return 'No enabled theme.json found, install a theme';
      const enabledThemeData = JSON.parse(
        await readFile(join(enabledThemePath, 'theme.json'), 'utf-8'),
      );
      themes.enabled = enabledThemeData;
    } catch (_) {
      themes.enabled = {};
    }

    try {
      const disabledThemesDir = await readdir(disabledThemesPath);
      const disabledThemeData = disabledThemesDir.map(async (dir) => {
        const state = await lstat(join(disabledThemesPath, dir));
        if (state.isDirectory()) {
          const disabledTheme = await readdir(join(disabledThemesPath, dir));
          const disabledThemeJsonIndex = disabledTheme.indexOf('theme.json');
          if (disabledThemeJsonIndex <= -1) return undefined;
          const themeData = JSON.parse(
            await readFile(
              join(disabledThemesPath, dir, 'theme.json'),
              'utf-8',
            ),
          );
          return themeData;
        }
      });
      themes.disabled = await Promise.all(disabledThemeData);
    } catch (_) {
      themes.disabled = [];
    }

    return themes;
  } catch (error) {
    throw error || new Error('Error while reading themes');
  }
};

import theme from './lib/theme';

app.get('/', async (req, res) => {
  const themes = await theme.allThemes();
  res.render('index', { themes });
});

app.post('/enable-theme', async (req, res) => {
  const { identifier } = req.body;

  try {
    await util.themeEnabler(identifier);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.send(error.message);
  }
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});

// import util from './lib/theme';

// util
//   .themeEnabler('dark-land')
//   .deleteFileAndFolder('test', 'jDg8El')

// util
//   .copyFileAndFolder({
//     from: [cwd(), 'themes', 'enabled'],
//     to: [cwd(), 'test', util.generateRandomString(5)],
//   })
// .then(console.log)
// .catch((error) => console.error(error.message));
