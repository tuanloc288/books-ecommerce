import Joi from 'joi'
import { getDB } from '../config/mongodb.js'
import { getCurrentDate  } from '../utils/getCurrentDate.js'

const schema = Joi.object({
    billID: Joi.string().required().min(3),
    orderDate: Joi.date().timestamp().default(getCurrentDate()),
    status: Joi.string().default('Chưa xử lý'),
    handleDate: Joi.string().default('Đang chờ xử lý'),
    discount: Joi.number().default(0),
    totalAmount: Joi.number(),
    userName: Joi.string().default(null),
    name: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    try {
        const validated = await schema.validateAsync(data, { abortEarly: false})
        return validated
    } catch (error) {
        return ({err: 'Kiểm tra hóa đơn thất bại: ' + error})
    }
}

const getAll = async () => {
    try {
        const all = await getDB().collection('bills').find().toArray()
        return all
    } catch (error) {
        return ({err: 'Lấy tất cả hóa đơn thất bại: ' + error})
    }
}

const getOne = async (id) => {
    try {
        const data = await getDB().collection('bills').find({userName: id}).toArray()
        if(!data){
            return ({err: `Không tìm thấy hóa đơn của tài khoản:${id}`})
        }
        return data
    } catch (error) {
        return ({err: `Lấy tất cả hóa đơn của tài khoản:${id} thất bại: ` + error})
    }
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const all = await getDB().collection('bills').find().toArray()
        for(let i = 0; i < all.length; i++){
            if(data.billID === all[i].billID) {
                return ({err: 'Tạo hóa đơn thất bại (billID đã tồn tại)!'})
            }
        }
        if(!value.err){
            await getDB().collection('bills').insertOne(value)
            return ({message: 'Tạo hóa đơn thành công'})
        }
        return ({err: 'Tạo hóa đơn thất bại: ' + value.err})
    } catch(error) {
        return ({err: 'Tạo hóa đơn thất bại: ' + error})
    }
}

const updateOne = async (id, data) => {
    try {
        const existed = await getDB().collection('bills').findOne({billID: id})
        if(!existed){
            return ({err: 'Không tìm thấy BillID'})
        }
        const condition = Joi.object({
            status: Joi.string(),
            handleDate: Joi.string(),
            name: Joi.string(),
            phone: Joi.string(),
            address: Joi.string(),
            _destroy: Joi.boolean()
        })
        let value
        try {
            if(Object.keys(data).length === 0){
                return ({err: 'Không thể cập nhật vì dữ liệu rỗng!'})
            }
            value = await condition.validateAsync(data, { abortEarly: false})
        } catch (error) {
            return({err: `Kiểm tra billID:${id} thất bại: ` + error})
        }
        await getDB().collection('bills').updateOne({billID: id},{$set: value})
        await getDB().collection('bills').updateOne({billID: id},{$set: {updatedAt: getCurrentDate()}})
        return({message: `Cập nhật billID:${id} thành công`})
    } catch (error) {
        return({err: `Cập nhật billID:${id} thất bại: ` + error})
    }
}

const deleteOne = async (id) => {
    try {
        try {
            const data = await getDB().collection('bills').findOne({billID: id})
            await getDB().collection('bills').deleteOne({billID: data.billID})
            return({message: `Xóa billID:${id} thành công`})
        } catch (error) {
            return ({err: 'Không tìm thấy BillID'})
        }
    } catch (error) {
        return({err: `Xóa billID:${id} thất bại: ` + error})
    }
}

export const BillModel = { createNew , getAll , getOne, updateOne, deleteOne}