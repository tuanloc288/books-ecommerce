import express from "express";
import { connectDB } from "./config/mongodb.js";
import { env } from "./config/env.js";
import { allRoutes } from "./routers/index.js";

connectDB()
  .then(() => console.log("Connected successfully to server")) // connect dc den sv thi moi listen/use cac port
  .then(() => bootServer())
  .catch((err) => {
    console.log(err);
    process.exit(1); // loi thi ngung han ung dung
  });

const bootServer = () => {
  const app = express();

  app.use("/api", allRoutes);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Listening on port ${env.APP_PORT}`);
  });
};
