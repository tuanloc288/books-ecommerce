import Joi from 'joi'
import { getDB } from '../config/mongodb.js'
import { getCurrentDate  } from '../utils/getCurrentDate.js'

const schema = Joi.object({
    cartDetailID: Joi.string().min(7).required(),
    userName: Joi.string().required().min(3),
    productID: Joi.string().required().min(4),
    price: Joi.number(),
    quantity: Joi.number(),
    discount: Joi.number(),
    totalAmount: Joi.number(),
    createdAt: Joi.date().timestamp().default(getCurrentDate()),
    updatedAt: Joi.date().timestamp().default(null)
})

const validateSchema = async (data) => {
    try {
        const validated = await schema.validateAsync(data, { abortEarly: false})
        return validated
    } catch (error) {
        return ({err: 'Kiểm tra chi tiết giỏ hàng thất bại: ' + error})
    }
}

const getAll = async (id) => {
    try {
        const all = await getDB().collection('cartDetail').find({userName: id}).toArray()
        if(all.length === 0){
            return ({err: 'Không tìm thấy cartID'})
        }
        return all
    } catch (error) {
        return ({err: 'Lấy tất cả chi tiết giỏ hàng thất bại: ' + error})
    }
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const all = await getDB().collection('cartDetail').find().toArray()
        for(let i = 0; i < all.length; i++){
            if(data.cartDetailID === all[i].cartDetailID) {
                return ({err: 'Tạo chi tiết giỏ hàng thất bại (cartDetailID đã tồn tại)!'})
            }
        }
        if(!value.err){
            await getDB().collection('cartDetail').insertOne(value)
            return ({message: 'Tạo chi tiết giỏ hàng thành công'})
        }
        return ({err: 'Tạo chi tiết giỏ hàng thất bại: ' + value.err})
    } catch(error) {
        return ({err: 'Tạo chi tiết giỏ hàng thất bại: ' + error})
    }
}

const updateOne = async (id, data) => {
    try {
        const existed = await getDB().collection('cartDetail').findOne({cartDetailID: id})
        if(!existed){
            return ({err: 'Không tìm thấy cartDetailID'})
        }
        const condition = Joi.object({
            quantity: Joi.number(),
            totalAmount: Joi.number()
        })
        let value 
        try {
            if(Object.keys(data).length === 0){
                return ({err:  `Không thể cập nhật cartDetail thuộc cartID${id} vì dữ liệu truyền vào rỗng!`})
            }
            value = await condition.validateAsync(data, {abortEarly: false})
        } catch (error) {
            return ({err: `Kiểm tra chi tiết giỏ hàng with cartID${id} thất bại: ` + error})
        }
        await getDB().collection('cartDetail').updateOne({cartDetailID: id} , {$set: {quantity: value.quantity, totalAmount: value.totalAmount, updatedAt: getCurrentDate()}})
        return({message: `Cập nhật các cartDetail thuộc cartID:${id} thành công`})
    } catch (error) {
        return({err: `Cập nhật các cartDetail thuộc cartID:${id} thất bại: ` + error})
    }
}

const updateUserName = async (user , oldUser) => {
    try {
        const existed = await getDB().collection('cartDetail').findOne({userName: oldUser})
        if(!existed){
            return ({err: 'Không tìm thấy cartDetailID'})
        }
        await getDB().collection('cartDetail').updateMany({userName: oldUser} , {$set: {userName: user, updatedAt: getCurrentDate()}})    
        return({message: `Cập nhật userName cho cardDetail thành công!`})
    } catch (error) {
        return({err: `Cập nhật userName cho cardDetail thất bại: ` + error})
    }
}

const deleteOne = async (id) => {
    try {
        try {
            const data = await getDB().collection('cartDetail').findOne({cartDetailID: id})
            await getDB().collection('cartDetail').deleteOne({cartDetailID: data.cartDetailID})
            return({message: `Xóa cartDetailID:${id} thành công`})
        } catch (error) {
            return ({err: 'Không tìm thấy cartDetailID'})
        }
    } catch (error) {
        return({err: `Xóa cartDetailID:${id} thất bại: ` + error})
    }
}

export const CartDetailModel = { createNew , getAll, updateOne, updateUserName , deleteOne}