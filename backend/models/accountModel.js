import Joi from 'joi'
import { getDB } from '../config/mongodb.js'
import { getCurrentDate  } from '../utils/getCurrentDate.js'
import { generateBcryptCode } from '../utils/generateBcrypt.js'

const schema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
    isAvailable: Joi.boolean().default(true),
    isRemembered: Joi.boolean().default(false),
    privileged: Joi.array().items(Joi.string().min(3)).default(['CTM']),
    createdAt: Joi.date().timestamp().default(getCurrentDate()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    try {
        const validated = await schema.validateAsync(data, { abortEarly: false})
        return validated
    } catch (error) {
        return ({err: 'Kiểm tra tài khoản thất bại: ' + error})
    }
}

const getAll = async () => {
    try {
        const all = await getDB().collection('accounts').find().toArray()
        return all
    } catch (error) {
        return ({err: 'Lấy tất cả tài khoản thất bại: ' + error})
    }
}

const getOne = async (id) => {
    try {
        const data = await getDB().collection('accounts').findOne({userName: id})
        if(!data){
            return ({err: 'Không tìm thấy tài khoản!'})
        }
        return data
    } catch (error) {
        return ({err: `Lấy tài khoản:${id} thất bại: ` + error})
    }
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const all = await getDB().collection('accounts').find().toArray()
        for(let i = 0; i < all.length; i++){
            if(data.userName === all[i].userName) {
                return ({err: 'Tạo tài khoản thất bại (tài khoản đã tồn tại)!'})
            }
        }
        if(!value.err){
            value.password = await generateBcryptCode(value.password, 5)
            await getDB().collection('accounts').insertOne(value)
            return ({message: 'Tạo tài khoản thành công'})
        }
        return ({err: 'Tạo tài khoản thất bại: ' + value.err})
    } catch(error) {
        return ({err: 'Tạo tài khoản thất bại: ' + error})
    }
}

const updateOne = async (id, data) => {
    try {
        const existed = await getDB().collection('accounts').findOne({userName: id})
        if(!existed){
            return ({err: 'Không tìm thấy userName'})
        }
        const condition = Joi.object({
            password: Joi.string(),
            isAvailable: Joi.boolean(),
            isRemembered: Joi.boolean(),
            privileged: Joi.array().items(Joi.string().min(3)),
            _destroy: Joi.boolean()
        })
        let value
        try {
            if(Object.keys(data).length === 0){
                return ({err: 'Không thể cập nhật vì dữ liệu truyền vào rỗng'})
            }
            value = await condition.validateAsync(data, { abortEarly: false})
        } catch (error) {
            return({err: `Kiểm tra tài khoản:${id} thất bại: ` + error})
        }
        if(value.password) 
            value.password = await generateBcryptCode(value.password, 5)
        await getDB().collection('accounts').updateOne({userName: id},{$set: value})
        await getDB().collection('accounts').updateOne({userName: id},{$set: {updatedAt: getCurrentDate()}})
        return({message: `Cập nhật userName:${id} thành công`})
    } catch (error) {
        return({err: `Cập nhật userName:${id} thất bại: ` + error})
    }
}

const deleteOne = async (id) => {
    try {
        try {
            const data = await getDB().collection('accounts').findOne({userName: id})
            await getDB().collection('accounts').deleteOne({userName: data.userName})
            return({message: `Xóa userName:${id} thành công`})
        } catch (error) {
            return ({err: 'Không tìm thấy tài khoản'})
        }
    } catch (error) {
        return({err: `Xóa userName:${id} thất bại: ` + error})
    }
}

export const AccountModel = { createNew , getAll , getOne, updateOne, deleteOne}