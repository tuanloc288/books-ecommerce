import express from "express";
import { CartController } from "../controllers/cartController.js"; 

const router = express.Router()

router.route('/')
    .get(CartController.getAllCarts)
    .post(CartController.createCart)
    .put(CartController.updateCartUser)

router.route('/:id')
    .get(CartController.getOneCart)
    .put(CartController.updateOneCart)
    .delete(CartController.deleteOneCart)


export const cartRoutes = router