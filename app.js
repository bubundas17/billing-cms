import express from 'express';
import mongoose from 'mongoose';
import envSchema from 'env-schema';

envSchema({
  dotenv: true,
  schema: {
    type: 'object',
    properties: {
      NODE_ENV: { type: 'string', enum: ['development', 'production'] },
      PORT: { type: 'number' },
      MONGO_URI: { type: 'string' },
    },
    required: ['NODE_ENV', 'PORT', 'MONGO_URI'],
  },
});

const app = express();
const port = process.env.PORT;

app.listen(port, async () => {
  console.log(`App listening on port ${port}`);

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
