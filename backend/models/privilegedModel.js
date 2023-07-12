import Joi from 'joi'
import { getDB } from '../config/mongodb.js'
import { getCurrentDate  } from '../utils/getCurrentDate.js'

const schema = Joi.object({
    privilegedID: Joi.string().required().min(3),
    detail: Joi.string().required().min(5),
    createdAt: Joi.date().timestamp().default(getCurrentDate()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    try {
        const validated = await schema.validateAsync(data, { abortEarly: false})
        return validated
    } catch (error) {
        return ({err: 'Kiểm tra phân quyền thất bại: ' + error})
    }
}

const getAll = async () => {
    try {
        const all = await getDB().collection('privileged').find().toArray()
        return all
    } catch (error) {
        return ({err: 'Lấy tất cả phân quyền thất bại: ' + error})
    }
}

const getOne = async (id) => {
    try {
        const data = await getDB().collection('privileged').findOne({privilegedID: id})
        if(!data) {
            return ({err: 'Không tìm thấy PrivilegedID'})
        }
        return data
    } catch (error) {
        return ({err: `Lấy privilegedID:${id} thất bại: ` + error})
    }
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const all = await getDB().collection('privileged').find().toArray()
        for(let i = 0; i < all.length; i++){
            if(data.privilegedID === all[i].privilegedID) {
                return ({err: 'Tạo phân quyền thất bại (privilegedID đã tồn tại)!'})
            }
        }
        if(!value.err){
            await getDB().collection('privileged').insertOne(value)
            return ({message: 'Tạo phân quyền thành công'})
        }
        return ({err: 'Tạo phân quyền thất bại: ' + value.err})
    } catch(error) {
        return ({err: 'Tạo phân quyền thất bại: ' + error})
    }
}

const updateOne = async (id, data) => {
    try {
        const existed = await getDB().collection('privileged').findOne({privilegedID: id})
        if(!existed){
            return ({err: 'Không tìm thấy PrivilegedID'})
        }
        const condition = Joi.object({
            detail: Joi.string(),
            _destroy: Joi.boolean()
        })
        let value
        try {
            if(Object.keys(data).length === 0){
                return ({err: 'Không thể cập nhật phân quyền vì dữ liệu rỗng!'})
            }
            value = await condition.validateAsync(data, { abortEarly: false})
        } catch (error) {
            return({err: `Kiểm tra privilegedID:${id}  thất bại: ` + error})
        }
        await getDB().collection('privileged').updateOne({privilegedID: existed.privilegedID},{$set: value})
        await getDB().collection('privileged').updateOne({privilegedID: existed.privilegedID},{$set: {updatedAt: getCurrentDate()}})
        return({message: `Cập nhật privilegedID:${id} thành công`})
    } catch (error) {
        return({err: `Cập nhật privilegedID:${id} thất bại: ` + error})
    }
}

const deleteOne = async (id) => {
    try {
        try {
            const data = await getDB().collection('privileged').findOne({privilegedID: id})
            await getDB().collection('privileged').deleteOne({privilegedID: data.privilegedID})
            return({message: `Xóa privilegedID:${id} thành công`})
        } catch (error) {
            return ({err: 'PrivilegedID not found'})
        }
    } catch (error) {
        return({err: `Xóa privilegedID:${id} thất bại: ` + error})
    }
}

export const PrivilegedModel = { createNew , getAll , getOne, updateOne, deleteOne}