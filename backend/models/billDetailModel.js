import Joi from 'joi'
import { getDB } from '../config/mongodb.js'
import { getCurrentDate  } from '../utils/getCurrentDate.js'

const schema = Joi.object({
    billDetailID: Joi.string().min(7).required(),
    billID: Joi.string().required().min(3),
    productID: Joi.string().required().min(4),
    price: Joi.number(),
    quantity: Joi.number(),
    discount: Joi.number(),
    totalAmount: Joi.number(),
    createdAt: Joi.date().timestamp().default(getCurrentDate()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    try {
        const validated = await schema.validateAsync(data, { abortEarly: false})
        return validated
    } catch (error) {
        return ({err: 'Kiểm tra chi tiết hóa đơn thất bại: ' + error})
    }
}

const getAll = async (id) => {
    try {
        const all = await getDB().collection('billDetail').find({billID: id}).toArray()
        return all
    } catch (error) {
        return ({err: 'Lấy tất cả chi tiết hóa đơn thất bại: ' + error})
    }
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const all = await getDB().collection('billDetail').find().toArray()
        for(let i = 0; i < all.length; i++){
            if(data.billDetailID === all[i].billDetailID) {
                return ({err: 'Tạo chi tiết hóa đơn thất bại (billDetailID đã tồn tại)!'})
            }
        }
        if(!value.err){
            await getDB().collection('billDetail').insertOne(value)
            return ({message: 'Tạo chi tiết hóa đơn thành công'})
        }
        return ({err: 'Tạo chi tiết hóa đơn thất bại: ' + value.err})
    } catch(error) {
        return ({err: 'Tạo chi tiết hóa đơn thất bại: ' + error})
    }
}

const updateDestroy = async (id, isDestroy) => {
    try {
        const existed = await getDB().collection('billDetail').findOne({billID: id})
        if(!existed){
            return ({err: 'Không tìm thấy billID'})
        }
        await getDB().collection('billDetail').updateMany({billID: id},{$set:  {_destroy: isDestroy._destroy , updatedAt: getCurrentDate()}})
        return({message: `Cập nhật tất cả billDetail thuộc billID:${id}'s _destroy thành ${isDestroy._destroy} successfully`})
    } catch (error) {
        return({err: `Cập nhật tất cả billDetail thuộc billID:${id}'s _destroy thành ${isDestroy._destroy} thất bại: ` + error})
    }
}

const deleteOne = async (id) => {
    try {
        try {
            const data = await getDB().collection('billDetail').findOne({billDetailID: id})
            await getDB().collection('billDetail').deleteOne({billDetailID: data.billDetailID})
            return({message: `Xóa billDetailID:${id} thành công`})
        } catch (error) {
            return ({err: 'Không tìm thấy billDetailID muốn xóa'})
        }
    } catch (error) {
        return({err: `Xóa billDetailID:${id} thất bại: ` + error})
    }
}

export const BillDetailModel = { createNew , getAll, updateDestroy, deleteOne}