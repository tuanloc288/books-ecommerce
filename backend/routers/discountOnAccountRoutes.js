import express from "express";
import { AuthorizationController } from "../controllers/authorizationController.js";
import { DiscountOnAccountController } from "../controllers/discountOnAccountController.js"; 

const router = express.Router()

router.route('/')
    .get(AuthorizationController.verifyAdmin , DiscountOnAccountController.getAllDiscountOnAccount)
    .post(AuthorizationController.verifyAdmin , DiscountOnAccountController.createDiscountOnAccount)
    .put(AuthorizationController.verifyToken , DiscountOnAccountController.updateDestroy)

router.route('/:id')
    .get(AuthorizationController.verifyToken , DiscountOnAccountController.getOneDiscountOnAccount)
    .put(AuthorizationController.verifyAdmin , DiscountOnAccountController.updateOneDiscountOnAccount)
    .delete(AuthorizationController.verifyAdmin , DiscountOnAccountController.deleteOneDiscountOnAccount)


export const discountOnAccountRoutes = router