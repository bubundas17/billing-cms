import envSchema from 'env-schema';

interface Env {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  SESSION_SECRET: string;
  JWT_SECRET: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_STARTTLS: boolean;
  SMTP_USERNAME: string;
  SMTP_PASSWORD: string;
  SMTP_FROM_NAME: string;
  SMTP_FROM_EMAIL: string;
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
      SMTP_HOST: { type: 'string', default: 'localhost' },
      SMTP_PORT: { type: 'number', default: 25 },
      SMTP_USERNAME: { type: 'string', default: 'user' },
      SMTP_PASSWORD: { type: 'string', default: 'pass' },
      SMTP_TLS: { type: 'boolean', default: false },
      SMTP_STARTTLS: { type: 'boolean', default: false },
      SMTP_FROM_NAME: { type: 'string', default: 'From Name' },
      SMTP_FROM_EMAIL: { type: 'string', default: '' },
    },
  },
});

export default env;
