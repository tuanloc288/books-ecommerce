import express from "express";
import { PrivilegedController } from "../controllers/privilegedController.js"; 

const router = express.Router()

router.route('/')
    .get(PrivilegedController.getAllPrivileged)
    .post(PrivilegedController.createPrivileged)

router.route('/:id')
    .get(PrivilegedController.getOnePrivileged)
    .put(PrivilegedController.updateOnePrivileged)
    .delete(PrivilegedController.deleteOnePrivileged)


export const privilegedRoutes = router