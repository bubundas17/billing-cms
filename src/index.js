import { join } from 'path';

import express from 'express';
import mongoose from 'mongoose';
import { create } from 'express-handlebars';

import env from './configs/env.config';
import routes from './routes';

const hbs = create({
  extname: 'hbs',
  defaultLayout: 'main',
});

const app = express();

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'views'));

app.get('/', (_req, res) => {
  res.render('index');
});

app.use(routes);

app.listen(env.PORT, async () => {
  console.log(`Server started on port ${env.PORT}`);

  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('Database connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
