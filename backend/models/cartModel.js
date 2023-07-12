import Joi from 'joi'
import { getDB } from '../config/mongodb.js'
import { getCurrentDate  } from '../utils/getCurrentDate.js'
import { CartDetailModel } from './cartDetailModel.js'

const schema = Joi.object({
    userName: Joi.string().required().min(3),
    discount: Joi.number().default(0),
    totalAmount: Joi.number(),
    createdAt: Joi.date().timestamp().default(getCurrentDate()),
    updatedAt: Joi.date().timestamp().default(null)
})

const validateSchema = async (data) => {
    try {
        const validated = await schema.validateAsync(data, { abortEarly: false})
        return validated
    } catch (error) {
        return ({err: 'Kiểm tra giỏ hàng thất bại: ' + error})
    }
}

const getAll = async () => {
    try {
        const all = await getDB().collection('carts').find().toArray()
        return all
    } catch (error) {
        return ({err: 'Lấy tất cả giỏ thất bại: ' + error})
    }
}

const getOne = async (id) => {
    try {
        const data = await getDB().collection('carts').findOne({userName: id})
        if(!data){
            return ({err: 'Không tìm thấy CartID'})
        }
        return data
    } catch (error) {
        return ({err: `Lấy cartID:${id} thất bại: ` + error})
    }
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const all = await getDB().collection('carts').find().toArray()
        for(let i = 0; i < all.length; i++){
            if(data.cartID === all[i].userName) {
                return ({err: 'Tạo giỏ hàng thất bại (cartID đã tồn tại)!'})
            }
        }
        if(!value.err){
            await getDB().collection('carts').insertOne(value)
            return ({message: 'Tạo giỏ hàng thành công'})
        }
        return ({err: 'Tạo giỏ hàng thất bại: ' + value.err})
    } catch(error) {
        return ({err: 'Tạo giỏ hàng thất bại: ' + error})
    }
}

const updateOne = async (id, data) => {
    try {
        const existed = await getDB().collection('carts').findOne({userName: id})
        if(!existed){
            return ({err: 'Không tìm thấy CartID'})
        }
        const condition = Joi.object({
            discount: Joi.number(),
            totalAmount: Joi.number(),
        })
        const all = await getDB().collection('carts').find().toArray()
        let value
        try {
            if(Object.keys(data).length === 0){
                return ({err: 'Không thể cập nhật vì dữ liệu rỗng!'})
            }
            value = await condition.validateAsync(data, { abortEarly: false})
        } catch (error) {
            return({err: `Kiểm tra cartID:${id} thất bại: ` + error})
        }
        await getDB().collection('carts').updateOne({userName: id},{$set: value})
        await getDB().collection('carts').updateOne({userName: id},{$set: {updatedAt: getCurrentDate()}})
        return({message: `Cập nhật cartID:${id} thành công`})
    } catch (error) {
        return({err: `Cập nhật cartID:${id} thất bại: ` + error})
    }
}

const updateUserName = async (user, oldUser) => {
    try {
        const existed = await getDB().collection('carts').findOne({userName: oldUser})
        if(!existed) {
            return ({err: 'Cart Không tìm thấy id!'})
        }
        await CartDetailModel.updateUserName(user, oldUser)
        return ({message: 'Cập nhật username thành công!'})
    } catch (error) {   
        return ({err: 'Cập nhật username thất bại: ' + error})
    }
}

const deleteOne = async (id) => {
    try {
        try {
            const data = await getDB().collection('carts').findOne({userName: id})
            await getDB().collection('carts').deleteOne({userName: data.userName})
            return({message: `Xóa cartID:${id} thành công`})
        } catch (error) {
            return ({err: 'Không tìm thấy cartID'})
        }
    } catch (error) {
        return({err: `Xóa cartID:${id} thất bại: ` + error})
    }
}

export const CartModel = { createNew , getAll , getOne, updateOne, updateUserName, deleteOne}