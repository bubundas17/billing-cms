import express from 'express';
import mongoose from 'mongoose';

import env from './configs/env.config.js';

const app = express();
const port = env.PORT;

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
