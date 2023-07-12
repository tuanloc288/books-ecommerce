import Joi from 'joi'
import { getDB } from '../config/mongodb.js'
import { getCurrentDate  } from '../utils/getCurrentDate.js'

const schema = Joi.object({
    categoryID: Joi.string().required().min(5),
    name: Joi.string().required().min(5),
    createdAt: Joi.date().timestamp().default(getCurrentDate()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false) 
})

const validateSchema = async (data) => {
    try {
        const validated = await schema.validateAsync(data, { abortEarly: false})
        return validated
    } catch (error) {
        return ({err: 'Kiểm tra thể loại thất bại: ' + error})
    }
}

const getAll = async () => {
    try {
        const all = await getDB().collection('categories').find().toArray()
        return all
    } catch (error) {
        return ({err: 'Lấy tất cả category thất bại: ' + error})
    }
}

const getOne = async (id) => {
    try {
        const data = await getDB().collection('categories').findOne({categoryID: id})
        return data
    } catch (error) {
        return ({err: `Lấy categoryID:${id} thất bại: ` + error})
    }
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const all = await getDB().collection('categories').find().toArray()
        for(let i = 0; i < all.length; i++){
            if(data.categoryID === all[i].categoryID) {
                return ({err: 'Tạo thể loại failed (categoryID đẫ tồn tại)!'})
            }
        }
        if(!value.err){
            await getDB().collection('categories').insertOne(value)
            return ({message: 'Tạo thể loại thành công'})
        }
        return ({err: 'Tạo thể loại thất bại: ' + value.err})
    } catch(error) {
        return ({err: 'Tạo thể loại thất bại: ' + error})
    }
}

const updateOne = async (id, data) => {
    try {
        const existed = await getDB().collection('categories').findOne({categoryID: id})
        if(!existed){
            return ({err: 'Không tìm thấy CategoryID'})
        }
        const condition = Joi.object({
            name: Joi.string().required().min(5),
            _destroy: Joi.boolean() 
        })
        let value
        try {
            if(Object.keys(data).length === 0){
                return ({err: 'không thể cập nhật thể loại vì dữ liệu rỗng!'})
            }
            value = await condition.validateAsync(data, { abortEarly: false})
        } catch (error) {
            return({err: `Kiểm tra categoryID:${id}  thất bại: ` + error})
        }
        await getDB().collection('categories').updateOne({categoryID: id},{$set: value})
        await getDB().collection('categories').updateOne({categoryID: id},{$set: {updatedAt: getCurrentDate()}})
        return({message: `Cập nhật categoryID:${id} thành công`})
    } catch (error) {
        return({err: `Cập nhật categoryID:${id} thất bại: ` + error})
    }
}

const deleteOne = async (id) => {
    try {
        try {
            const data = await getDB().collection('categories').findOne({categoryID: id})
            await getDB().collection('categories').deleteOne({categoryID: data.categoryID})
            return({message: `Xóa categoryID:${id} thành công`})
        } catch (error) {
            return ({err: 'Không tìm thấy CategoryID'})
        }
    } catch (error) {
        return({err: `Xóa categoryID:${id} thất bại: ` + error})
    }
}

export const CategoryModel = { createNew , getAll , getOne, updateOne, deleteOne}