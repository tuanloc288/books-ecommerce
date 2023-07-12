import express from "express";
import { AuthorizationController } from "../controllers/authorizationController.js";
import { ProductController } from '../controllers/productController.js'

const router = express.Router()

router.route('/')
    .get(ProductController.getAllProducts)
    .post(AuthorizationController.verifyAdmin , ProductController.createProduct)

router.route('/:id')
    .get(ProductController.getOneProduct)
    .put(AuthorizationController.verifyAdmin , ProductController.updateOneProduct)
    .delete(AuthorizationController.verifyAdmin , ProductController.deleteOneProduct)

export const productRoutes = router