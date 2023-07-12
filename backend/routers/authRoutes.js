import express from "express";
import { AuthController } from "../controllers/authController.js";


const router = express.Router()

router.route('/signUp')
    .post(AuthController.signUp)
router.route('/signIn')
    .post(AuthController.signIn)
router.route('/signOut')
    .post(AuthController.signOut)
router.route('/sendMail')
    .post(AuthController.sendMail)
router.route('/refreshToken')
    .post(AuthController.requestRefreshToken)

export const authRoutes = router