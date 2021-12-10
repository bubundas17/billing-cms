import express from 'express';
import envSchema from 'env-schema';
import mongoose from 'mongoose';

envSchema({
  dotenv: true,
  schema: {
    type: 'object',
    properties: {
      PORT: {
        type: 'number',
        default: 3000,
      },
      MONGO_URI: {
        type: 'string',
        default: 'mongodb://localhost:27017/test',
      },
    },
    required: ['PORT', 'MONGO_URI'],
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
