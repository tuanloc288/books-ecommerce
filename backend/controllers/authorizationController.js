import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AccountModel } from "../models/accountModel.js";

const verifyToken = (req, res, next) => {
    const token = req.headers.token 
    if(token){
        const accessToken = token.split(' ')[1]
        jwt.verify(accessToken, env.JWT_ACCESS_TOKEN, (err, user) => {
            if(err)
                return res.status(200).json({err: 'Token không hợp lệ!'})
            req.user = user
            next()
        })
    }
    else {
        return res.status(200).json({err: 'Không tìm thấy token!'})
    }
}   

const verifyAdmin = (req, res , next) => {
    AuthorizationController.verifyToken(req, res, async () => {
        const user = await AccountModel.getOne(req.user.userName)
        if(!user.err && user.privileged.includes('ADM'))
            next()
        else {
            res.status(200).json({err: 'Bạn không được quyền!'})
        }
    })
}

export const AuthorizationController = { verifyToken, verifyAdmin }