import Joi from 'joi'
import { getDB } from '../config/mongodb.js'
import { getCurrentDate  } from '../utils/getCurrentDate.js'

const schema = Joi.object({
    importNoteDetailID: Joi.string().min(8).required(),
    importNoteID: Joi.string().required().min(4),
    productID: Joi.string().required().min(4),
    price: Joi.number(),
    quantity: Joi.number(),
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
        return ({err: 'Kiểm tra chi tiết phiếu nhập thất bại: ' + error})
    }
}

const getAll = async (id) => {
    try {
        const all = await getDB().collection('whImportNoteDetail').find({importNoteID: id}).toArray()
        if(all.length === 0){
            return ({err: 'Không tìm thấy importNoteID'})
        }
        return all
    } catch (error) {
        return ({err: 'Lấy tất cả chi tiết phiếu nhập thất bại: ' + error})
    }
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const all = await getDB().collection('whImportNoteDetail').find().toArray()
        for(let i = 0; i < all.length; i++){
            if(data.importNoteDetailID === all[i].importNoteDetailID) {
                return ({err: 'Tạo chi tiết phiếu nhập thất bại (importNoteDetailID đã tồn tại)!'})
            }
        }
        if(!value.err){
            await getDB().collection('whImportNoteDetail').insertOne(value)
            return ({message: 'Tạo chi tiết phiếu nhập thành công'})
        }
        return ({err: 'Tạo chi tiết phiếu nhập thất bại: ' + value.err})
    } catch(error) {
        return ({err: 'Tạo chi tiết phiếu nhập thất bại: ' + error})
    }
}

const updateOne = async (id, data) => {
    try {
        const existed = await getDB().collection('whImportNoteDetail').findOne({importNoteDetailID: id})
        if(!existed){
            return ({err: 'Không tìm thấy importNoteID'})
        }
        const condition = Joi.object({
            price: Joi.number(),
            quantity: Joi.number(),
            totalAmount: Joi.number()
        })
        let value 
        try {
            if(Object.keys(data).length === 0){
                return ({err:  `Không thể cập nhật chi tiết phiếu nhập thuộc importNoteID:${id} vì dữ liệu rỗng!`})
            }
            value = await condition.validateAsync(data, {abortEarly: false})
        } catch (error) {
            return ({err: `Kiểm tra chi tiết phiếu nhập thuộc importNoteID:${id} thất bại: ` + error})
        }
        await getDB().collection('whImportNoteDetail').updateOne({importNoteDetailID: id} , {$set: value})
        await getDB().collection('whImportNoteDetail').updateOne({importNoteDetailID: id} , {$set: {updatedAt: getCurrentDate()}})
        return({message: `Cập nhật tất cả importNoteID thuộc importNoteID:${id} thành công`})
    } catch (error) {
        return({err: `Cập nhật tất cả importNoteID thuộc importNoteID:${id} thất bại: ` + error})
    }
}

const updateDestroy = async (id, isDestroy) => {
    try {
        const existed = await getDB().collection('whImportNoteDetail').findOne({importNoteID: id})
        if(!existed){
            return ({err: 'here'})
        }
        await getDB().collection('whImportNoteDetail').updateMany({importNoteID: id},{$set:  {_destroy: isDestroy._destroy , updatedAt: getCurrentDate()}})
        return({message: `Cập nhật tất cả importNoteID thuộc importNoteID:${id}'s _destroy thành ${isDestroy._destroy} thành công`})
    } catch (error) {
        return({err: `Cập nhật tất cả importNoteID thuộc importNoteID:${id}'s _destroy thành ${isDestroy._destroy} thất bại: ` + error})
    }
}

const deleteOne = async (id) => { 
    try {
        try {
            const data = await getDB().collection('whImportNoteDetail').findOne({importNoteDetailID: id})
            await getDB().collection('whImportNoteDetail').deleteOne({importNoteDetailID: data.importNoteDetailID})
            return({message: `Xóa importNoteDetailID:${id} thành công`})
        } catch (error) {
            return ({err: 'chi tiết phiếu nhập ID'})
        }
    } catch (error) {
        return({err: `Xóa importNoteDetailID:${id} thất bại: ` + error})
    }
}

export const ImportNoteDetailModel = { createNew , getAll, updateOne, updateDestroy ,deleteOne}