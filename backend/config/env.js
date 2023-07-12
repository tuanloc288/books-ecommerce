import dotenv from "dotenv";
dotenv.config();

export const env = {
  APP_PORT: process.env.APP_PORT,
  APP_HOST: process.env.APP_HOST,
  MONGO_URI: process.env.MONGO_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN,
  JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN,
};
