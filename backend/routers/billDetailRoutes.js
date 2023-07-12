import express from "express";
import { AuthorizationController } from "../controllers/authorizationController.js";
import { BillDetailController } from "../controllers/billDetailController.js"; 

const router = express.Router()

router.route('/')
    .post(AuthorizationController.verifyToken , BillDetailController.createBillDetail)

router.route('/:id')
    .get(AuthorizationController.verifyToken , BillDetailController.getAllBillDetails)
    .put(AuthorizationController.verifyAdmin , BillDetailController.updateDestroyBillDetail)
    .delete(AuthorizationController.verifyToken ,BillDetailController.deleteOneBillDetail)


export const billDetailRoutes = router