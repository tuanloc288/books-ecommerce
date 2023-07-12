import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { authRoutes } from "./authRoutes.js";
import { accountRoutes } from "./accountRoutes.js";
import { billRoutes } from "./billRoutes.js";
import { billDetailRoutes } from "./billDetailRoutes.js";
import { cartRoutes } from "./cartRoutes.js";
import { cartDetailRoutes } from "./cartDetailRoutes.js";
import { categoryRoutes } from "./categoryRoutes.js";
import { discountOnAccountRoutes } from "./discountOnAccountRoutes.js";
import { discountOnCategoryRoutes } from "./discountOnCategoryRoutes.js";
import { productRoutes } from "./productRoutes.js";
import { privilegedRoutes } from "./privilegedRoutes.js";
import { importNoteRoutes } from "./whImportNoteRoutes.js";
import { importNoteDetailRoutes } from "./whImportNoteDetailRoutes.js";
import { AuthorizationController } from "../controllers/authorizationController.js";

const index = express();

index.use(cookieParser());
index.use(express.urlencoded({ extended: true }));
index.use(express.json());
index.use(cors({ credentials: true, origin: "http://localhost:3000" }));
index.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

index.use("/account", accountRoutes);
index.use("/bill", billRoutes);
index.use("/billDetail", billDetailRoutes);
index.use("/cart", cartRoutes);
index.use("/cartDetail", cartDetailRoutes);
index.use("/category", categoryRoutes);
index.use("/discountOnAccount", discountOnAccountRoutes);
index.use("/discountOnCategory", discountOnCategoryRoutes);
index.use("/product", productRoutes);
index.use("/privileged", AuthorizationController.verifyAdmin, privilegedRoutes);
index.use(
  "/whImportNote",
  AuthorizationController.verifyAdmin,
  importNoteRoutes
);
index.use(
  "/importNoteDetail",
  AuthorizationController.verifyAdmin,
  importNoteDetailRoutes
);
index.use("/signForm", authRoutes);

export const allRoutes = index;
