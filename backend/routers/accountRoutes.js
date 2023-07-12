import express from "express";
import { AccountController } from "../controllers/accountController.js"; 
import { AuthorizationController } from "../controllers/authorizationController.js";

const router = express.Router()

router.route('/')
    .get(AuthorizationController.verifyAdmin , AccountController.getAllAccounts)
    .post(AuthorizationController.verifyAdmin, AccountController.createAccount)

router.route('/:id')
    .get(AccountController.getOneAccount)
    .put(AccountController.updateOneAccount)
    .delete(AuthorizationController.verifyAdmin , AccountController.deleteOneAccount)


export const accountRoutes = router