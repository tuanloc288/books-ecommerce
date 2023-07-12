import express from "express";
import { AuthorizationController } from "../controllers/authorizationController.js";
import {CategoryController} from "../controllers/categoryController.js"; 

const router = express.Router()

router.route('/')
    .get(CategoryController.getAllCategories)
    .post(AuthorizationController.verifyAdmin , CategoryController.createCategory)

router.route('/:id')
    .get(CategoryController.getOneCategory)
    .put(AuthorizationController.verifyAdmin , CategoryController.updateOneCategory)
    .delete(AuthorizationController.verifyAdmin ,CategoryController.deleteOneCategory)


export const categoryRoutes = router