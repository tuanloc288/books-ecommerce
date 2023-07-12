import express from "express";
import { AuthorizationController } from "../controllers/authorizationController.js";
import { DiscountOnCategoryController } from "../controllers/discountOnCategoryController.js"; 

const router = express.Router()

router.route('/')
    .get(AuthorizationController.verifyToken,DiscountOnCategoryController.getAllDiscountOnCategory)
    .post(AuthorizationController.verifyAdmin ,DiscountOnCategoryController.createDiscountOnCategory)
    .put(AuthorizationController.verifyToken, DiscountOnCategoryController.updateDestroy)

router.route('/:id')
    .put(AuthorizationController.verifyAdmin , DiscountOnCategoryController.updateOneDiscountOnCategory)
    .delete(AuthorizationController.verifyAdmin , DiscountOnCategoryController.deleteOneDiscountOnCategory)


export const discountOnCategoryRoutes = router