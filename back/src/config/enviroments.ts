import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

const ENV = {
  APP_PORT: process.env.APP_PORT,

  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,

  JWTSECRET: process.env.JWTSECRET,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
};

export default ENV;
