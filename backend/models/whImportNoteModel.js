import Joi from 'joi'
import { getDB } from '../config/mongodb.js'
import { getCurrentDate  } from '../utils/getCurrentDate.js'

const schema = Joi.object({ 
    importNoteID: Joi.string().required().min(4),
    totalItems: Joi.number().required(),
    totalAmount: Joi.number().required(),
    userName: Joi.string().required(),
    createdAt: Joi.date().timestamp().default(getCurrentDate()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    try {
        const validated = await schema.validateAsync(data, { abortEarly: false})
        return validated
    } catch (error) {
        return ({err: 'Kiểm tra phiếu nhập thất bại: ' + error})
    }
}

const getAll = async () => {
    try {
        const all = await getDB().collection('whImportNote').find().toArray()
        return all
    } catch (error) {
        return ({err: 'Lấy tất cả phiếu nhập thất bại: ' + error})
    }
}

const getOne = async (id) => {
    try {
        const data = await getDB().collection('whImportNote').findOne({importNoteID: id})
        if(!data){
            return ({err: 'Không tìm thấy ImportNoteID'})
        }
        return data
    } catch (error) {
        return ({err: `Lấy importNoteID:${id} thất bại: ` + error})
    }
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const all = await getDB().collection('whImportNote').find().toArray()
        for(let i = 0; i < all.length; i++){
            if(data.importNoteID === all[i].importNoteID) {
                return ({err: 'Tạo phiếu nhập thất bại (importNoteID đã tồn tại)!'})
            }
        }
        if(!value.err){
            await getDB().collection('whImportNote').insertOne(value)
            return ({message: 'Tạo phiếu nhập thành công'})
        }
        return ({err: 'Tạo phiếu nhập thất bại: ' + value.err})
    } catch(error) {
        return ({err: 'Tạo phiếu nhập thất bại: ' + error})
    }
}

const updateOne = async (id, data) => {
    try {
        const existed = await getDB().collection('whImportNote').findOne({importNoteID: id})
        if(!existed){
            return ({err: 'Không tìm thấy ImportNoteID'})
        }
        const condition = Joi.object({
            totalItems: Joi.number(),
            totalAmount: Joi.number(),
            _destroy: Joi.boolean().default(false)
        })
        let value
        try {
            if(Object.keys(data).length === 0){
                return ({err: 'Không thể cập nhật phiếu nhập vì dữ liệu rỗng!'})
            }
            value = await condition.validateAsync(data, { abortEarly: false})
        } catch (error) {
            return({err: `Kiểm tra importNoteID:${id}  thất bại: ` + error})
        }
        await getDB().collection('whImportNote').updateOne({importNoteID: id},{$set: value})
        await getDB().collection('whImportNote').updateOne({importNoteID: id},{$set: {updatedAt: getCurrentDate()}})
        return({message: `Cập nhật importNoteID:${id} thành công`})
    } catch (error) {
        return({err: `Cập nhật importNoteID:${id} thất bại: ` + error})
    }
}

const deleteOne = async (id) => {
    try {
        try {
            const data = await getDB().collection('whImportNote').findOne({importNoteID: id})
            await getDB().collection('whImportNote').deleteOne({importNoteID: data.importNoteID})
            return({message: `Xóa importNoteID:${id} thành công`})
        } catch (error) {
            return ({err: 'Không tìm thấy ImportNoteID'})
        }
    } catch (error) {
        return({err: `Xóa importNoteID:${id} thất bại: ` + error})
    }
}

export const ImportNoteModel = { createNew , getAll , getOne, updateOne, deleteOne}