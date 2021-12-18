import { join } from 'path';
import { cwd, exit } from 'process';

import express from 'express';
import mongoose from 'mongoose';
import { create } from 'express-handlebars';
import morgan from 'morgan';

import env from './configs/env.config';
import routes from './routes';
import { get4xx, get5xx } from './controllers/error.controller';

const hbs = create({
  extname: 'hbs',
  defaultLayout: 'main',
});

const app = express();

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', join(cwd(), 'views'));

app.use('/public', express.static(join(cwd(), 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.render('index');
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
