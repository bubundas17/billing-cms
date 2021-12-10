import envSchema from 'env-schema';

const env = envSchema({
  dotenv: true,
  schema: {
    type: 'object',
    properties: {
      NODE_ENV: {
        type: 'string',
        enum: ['development', 'production'],
        default: 'development',
      },
      PORT: { type: 'number', default: 3000 },
      MONGO_URI: { type: 'string', default: 'mongodb://localhost:27017/test' },
    },
  },
});

export default env;
