import { AccountModel } from "../models/accountModel.js"
import { env } from '../config/env.js'
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const signUp = async (req, res) => {
    try {
        const newAccount = await AccountModel.createNew(req.body)
        res.status(201).json(newAccount)
    } catch (error) {
     res.status(500).json({err: 'Đăng ký tài khoản thất bại: ' + error})   
    }
}

const signIn = async (req, res) => {
    try {
        const user = await AccountModel.getOne(req.body.userName)
        if(user.err){
            return res.status(404).json({err: user.err})
        }
        if(!user.isAvailable){
            return res.status(403).json({err: 'Tài khoản của bạn đã bị khóa! Hãy liên hệ quản trị viên để được hỗ trợ.'})
        }
        const {password, ...others} = user
        if(await bcrypt.compare(req.body.password , user.password)) {
            if(req.body.isRemembered){
                const allAccounts = await AccountModel.getAll()
                for(let index in allAccounts){
                    await AccountModel.updateOne(allAccounts[index].userName, {isRemembered: false})
                }
                await AccountModel.updateOne(req.body.userName, {isRemembered: true})
            }
            else await AccountModel.updateOne(req.body.userName, {isRemembered: false})
            const newUser = await AccountModel.getOne(req.body.userName)
            const {newPassword, ...newOthers} = newUser
            let token = {
                ...req.body,
                isAdmin: newOthers.privileged.includes('ADM')
            }
            let accessToken = generateAccessToken(token)
            let refreshToken = generateRefreshToken(token)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: false,
                secure: false,
                path: '/',
                sameSite: 'strict'
            })
            return res.status(200).json(
                {
                    message: 'Đăng nhập thành công',
                    user: {
                        ...newOthers
                    },
                    isAdmin: newOthers.privileged.includes('ADM'),
                    accessToken 
                }
            )
        }
        res.status(404).json({err: 'Sai mật khẩu!'})
    } catch (error) {
        res.status(500).json({err: 'Đăng nhập thất bại: ' + error})   
    }
}

const generateVerificationCode = (length) => {
    const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var res = "";
    for(var i = 0; i < length; i++) {
        var rnd = Math.floor(Math.random() * list.length);
        res = res + list.charAt(rnd);
    }
    return res;
}

const generateAccessToken = (payload) => {
    return jwt.sign(payload, env.JWT_ACCESS_TOKEN, {expiresIn: '5m'})
}

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, env.JWT_REFRESH_TOKEN, {expiresIn: '30d'})
}

const signOut = async (req, res) => {
    try {
        res.clearCookie('refreshToken')
        res.status(200).json({message: 'Đăng xuất thành công'})
    } catch (error) {
        res.status(500).json({err: 'Error: ' + error})
    }
}

const sendMail = async (req, res) => {
    try {
        const senderEmail = 'booksecommerce2022@gmail.com'
        if(req.body.email === senderEmail)
            throw 'Không thể gửi chính mình!'
        let code = generateVerificationCode(15) // hoac dung bcrypt
        let date = new Date() 
        date.setMinutes(date.getMinutes() + 5)
        date = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
        let data = {
            code,
            expiredIn: new Date(date)
        }
        let transporter = nodemailer.createTransport({
            service: 'gmail',
                port: 465,
                secure: true, // true cho 465, false cho cac cong khac
                logger: true,
                debug: true,
                secureConnection: false,
                auth: {
                    user: `${senderEmail}`, 
                    pass: 'rxdnedwxdqyhtvwg', 
                },
                tls:{
                    rejectUnAuthorized:true
                }
        })
        await transporter.sendMail({
            from: `${senderEmail}`,
            to: `${req.body.email}`,
            subject: 'Mã xác thực email',
            text: `Mã xác thực email của bạn: ${data.code}`,
            html: `
                 <div style="width: fit-content; height: fit-content; margin: 0 auto;"> 
                   <h2 style="text-align:center;padding: 10px"> Mã xác thực email </h2>
                   <h4 style="background-color: #FAAB9F; text-align:center;padding: 10px;color: white"> ${data.code} </h4>
                 </div>
            `,
        })
        res.status(200).json(
            {
                message: 'Gửi mail thành công!',
                data
            })
    } catch (error) {
        res.status(500).json({err: 'Gửi mail thất bại: ' + error})
    }
}

const requestRefreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken)
        return res.status(401).json({err: 'Chưa đăng nhập!'})
    jwt.verify(refreshToken, env.JWT_REFRESH_TOKEN, (err, user) => {
        if(err)
            return res.status(403).json({err: 'Token không hợp lệ!'})
        const newAccessToken = generateAccessToken({userName: user.userName, password: user.password, isRemembered: user.isRemembered, isAdmin: user.isAdmin})
        const newRefreshToken = generateRefreshToken({userName: user.userName, password: user.password, isRemembered: user.isRemembered, isAdmin: user.isAdmin})
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: false,
            secure: false,
            path: '/',
            sameSite: 'strict'
        })
        res.status(200).json({accessToken: newAccessToken})
    })
}

export const AuthController = { signUp, signIn, signOut , sendMail, requestRefreshToken }