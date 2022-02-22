import { cleanEnv, str, port, url, bool } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: port(),
  MONGO_URI: url(),
  SESSION_SECRET: str(),
  JWT_SECRET: str(),
  SMTP_HOST: str(),
  SMTP_PORT: port(),
  SMTP_SECURE: bool(),
  SMTP_STARTTLS: bool(),
  SMTP_USERNAME: str(),
  SMTP_PASSWORD: str(),
  SMTP_FROM_NAME: str(),
  SMTP_FROM_EMAIL: str(),
});

export default env;
