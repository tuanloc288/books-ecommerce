import express from "express";
import { CartDetailController } from "../controllers/cartDetailController.js"; 

const router = express.Router()

router.route('/')
    .post(CartDetailController.createCartDetail)

router.route('/:id')
    .get(CartDetailController.getAllCartDetails)
    .put(CartDetailController.updateCartDetail)
    .delete(CartDetailController.deleteOneCartDetail)


export const cartDetailRoutes = router