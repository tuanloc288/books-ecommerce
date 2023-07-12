import express from "express";
import { AuthorizationController } from "../controllers/authorizationController.js";
import { BillController } from "../controllers/billController.js"; 

const router = express.Router()

router.route('/')
    .get(AuthorizationController.verifyAdmin , BillController.getAllBills)
    .post(AuthorizationController.verifyToken , BillController.createBill)

router.route('/:id')
    .get(AuthorizationController.verifyToken , BillController.getOneBill)
    .put(AuthorizationController.verifyAdmin , BillController.updateOneBill)
    .delete(AuthorizationController.verifyToken , BillController.deleteOneBill)


export const billRoutes = router