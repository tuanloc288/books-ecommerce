import { MongoClient } from "mongodb";
import { env } from "./env.js";

let dbInstance = null;

export const connectDB = async () => {
  const client = new MongoClient(env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  await client.connect();

  dbInstance = client.db(env.DATABASE_NAME);
};

export const getDB = () => {
  if (!dbInstance) {
    throw new Error("Must connect to db first!");
  }
  return dbInstance;
};
