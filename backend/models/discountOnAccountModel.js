import Joi from 'joi'
import { getDB } from '../config/mongodb.js'
import { getCurrentDate  } from '../utils/getCurrentDate.js'

const schema = Joi.object({
    DoAID: Joi.string().required().min(3),
    userName: Joi.string().required(),
    detail: Joi.number().required(),
    duration: Joi.date().required(),
    createdAt: Joi.date().timestamp().default(getCurrentDate()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false) 
})

const validateSchema = async (data) => {
    try {
        const validated = await schema.validateAsync(data, { abortEarly: false})
        return validated
    } catch (error) {
        return ({err: 'Kiểm DoA thất bại: ' + error})
    }
}

const getAll = async () => {
    try {
        const all = await getDB().collection('discountOnAccount').find().toArray()
        return all
    } catch (error) {
        return ({err: 'Lấy tất cả DoA thất bại: ' + error})
    }
}

const getOne = async (id) => {
    try {
        const data = await getDB().collection('discountOnAccount').find({userName: id}).toArray()
        if(!data){
            return ({err: `Không tìm thấy discountOnAccount của tài khoản:${id}`})
        }
        return data
    } catch (error) {
        return ({err: `Lấy discountOnAccount của tài khoản:${id} thất bại: ` + error})
    }
}

const updateDestroy = async () => {
    try {
        const all = await getDB().collection('discountOnAccount').find().toArray() 
        if(all.length !== 0){
            for(let i = 0; i < all.length; i++){
                if(all[i].duration < new Date()){
                    await getDB().collection('discountOnAccount').updateOne({DoAID: all[i].DoAID} , {$set: {_destroy: true}})
                }
            }
            return ({message: 'Cập nhật destroy cho tất cả DoA thành công'})
        }
        return ({message: 'Không có DoA nào để cập nhật...'})
    } catch (error) {
        return ({err: 'Cập nhật destroy cho tất cả DoA thất bại: ' + error})
    }
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const all = await getDB().collection('discountOnAccount').find().toArray()
        for(let i = 0; i < all.length; i++){
            if(data.DoAID === all[i].DoAID) {
                return ({err: 'Tạo DoA thất bại (DoAID đã tồn tại)!'})
            }
        }
        if(!value.err){
            await getDB().collection('discountOnAccount').insertOne(value)
            return ({message: 'Tạo DoA thành công'})
        }
        return ({err: 'Tạo DoA thất bại: ' + value.err})
    } catch(error) {
        return ({err: 'Tạo DoA thất bại: ' + error})
    }
}

const updateOne = async (id, data) => {
    try {
        const existed = await getDB().collection('discountOnAccount').findOne({DoAID: id})
        if(!existed){ 
            return ({err: 'Không tìm thấy DoAID'})
        }
        const condition = Joi.object({
            detail: Joi.number(),
            duration: Joi.date(),
            _destroy: Joi.boolean() 
        })
        let value
        try {
            if(Object.keys(data).length === 0){
                return ({err: 'Không thể cập nhật DoA vì dữ liệu rỗng!'})
            }
            value = await condition.validateAsync(data, { abortEarly: false})
        } catch (error) {
            return({err: `Kiểm tra DoAID:${id}  thất bại: ` + error})
        }
        await getDB().collection('discountOnAccount').updateOne({DoAID: id},{$set: value})
        await getDB().collection('discountOnAccount').updateOne({DoAID: id},{$set: {updatedAt: getCurrentDate()}})
        return({message: `Cập nhật DoAID:${id} thành công`})
    } catch (error) {
        return({err: `Cập nhật DoAID:${id} thất bại: ` + error})
    }
}

const deleteOne = async (id) => {
    try {
        try {
            const data = await getDB().collection('discountOnAccount').findOne({DoAID: id})
            await getDB().collection('discountOnAccount').deleteOne({DoAID: data.DoAID})
            return({message: `Xóa DoAID:${id} thành công`})
        } catch (error) {
            return ({err: 'DoAID not found'})
        }
    } catch (error) {
        return({err: `Xóa DoAID:${id} thất bại: ` + error})
    }
}

export const DiscountOnAccountModel = { createNew , getAll, getOne ,updateOne, updateDestroy , deleteOne}