import Joi from 'joi'
import { getDB } from '../config/mongodb.js'
import { getCurrentDate  } from '../utils/getCurrentDate.js'

const schema = Joi.object({
    DoCID: Joi.string().required().min(3),
    categoryID: Joi.string().required(),
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
        return ({err: 'Kiểm tra DoC thất bại: ' + error})
    }
}

const getAll = async () => {
    try {
        const all = await getDB().collection('discountOnCategory').find().toArray()
        return all
    } catch (error) {
        return ({err: 'Lấy tất cả DoC thất bại: ' + error})
    }
}

const updateDestroy = async () => {
    try {
        const all = await getDB().collection('discountOnCategory').find().toArray() 
        if(Object.keys(all).length !== 0){
            for(let i = 0; i < all.length; i++){
                if(all[i].duration < new Date().toLocaleDateString()){
                    await getDB().collection('discountOnCategory').updateOne({DoCID: all[i].DoCID} , {$set: {_destroy: true}})
                }
            }
            return ({message: 'Cập nhật destroy cho tất cả DoC thành công'})
        }
        return ({message: 'Không có DoC nào để cập nhật...'})
    } catch (error) {
        return ({err: 'Cập nhật destroy cho tất cả DoC thất bại: ' + error})
    }
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const all = await getDB().collection('discountOnCategory').find().toArray()
        for(let i = 0; i < all.length; i++){
            if(data.DoCID === all[i].DoCID) {
                return ({err: 'Tạo DoC thất bại (DoCID đã tồn tại)!'})
            }
        }
        if(!value.err){
            await getDB().collection('discountOnCategory').insertOne(value)
            return ({message: 'Tạo DoC thành công'})
        }
        return ({err: 'Tạo DoC thất bại: ' + value.err})
    } catch(error) {
        return ({err: 'Tạo DoC thất bại: ' + error})
    }
}

const updateOne = async (id, data) => {
    try {
        const existed = await getDB().collection('discountOnCategory').findOne({DoCID: id})
        if(!existed){ 
            return ({err: 'Không tìm thấy DoCID'})
        }
        const condition = Joi.object({
            detail: Joi.number(),
            duration: Joi.date(),
            _destroy: Joi.boolean() 
        })
        let value
        try {
            if(Object.keys(data).length === 0){
                return ({err: 'Không thể cập nhật DoC vì dữ liệu rỗng!'})
            }
            value = await condition.validateAsync(data, { abortEarly: false})
        } catch (error) {
            return({err: `Kiểm tra DoCID:${id} thất bại: ` + error})
        }
        await getDB().collection('discountOnCategory').updateOne({DoCID: id},{$set: value})
        await getDB().collection('discountOnCategory').updateOne({DoCID: id},{$set: {updatedAt: getCurrentDate()}})
        return({message: `Cập nhật DoCID:${id} thành công`})
    } catch (error) {
        return({err: `Cập nhật DoCID:${id} thất bại: ` + error})
    }
}

const deleteOne = async (id) => {
    try {
        try {
            const data = await getDB().collection('discountOnCategory').findOne({DoCID: id})
            await getDB().collection('discountOnCategory').deleteOne({DoCID: data.DoCID})
            return({message: `Xóa DoCID:${id} thành công`})
        } catch (error) {
            return ({err: 'Không tìm thấy DoCID'})
        }
    } catch (error) {
        return({err: `Xóa DoCID:${id} thất bại: ` + error})
    }
}

export const DiscountOnCategoryModel = { createNew , getAll, updateOne, updateDestroy , deleteOne}