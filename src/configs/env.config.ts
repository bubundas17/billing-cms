import envSchema from 'env-schema';

interface Env {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  SESSION_SECRET: string;
  JWT_SECRET: string;
}

const env = envSchema<Env>({
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
      MONGO_URI: {
        type: 'string',
        default: 'mongodb://localhost:27017/test',
      },
      JWT_SECRET: { type: 'string', default: 'secret' },
      SESSION_SECRET: { type: 'string', default: 'secret' },
    },
  },
});

export default env;
