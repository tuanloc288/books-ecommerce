import Joi from 'joi'
import { getDB } from '../config/mongodb.js'
import { getCurrentDate } from '../utils/getCurrentDate.js'

const schema = Joi.object({
    bookid: Joi.string().required().min(4),
    bookname: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.string().required(),
    category: Joi.string(),
    supplier: Joi.string().allow(''),
    author: Joi.string().allow(''),
    description: Joi.string().allow(''),
    inStock: Joi.number().allow(''),
    purchased: Joi.number().default(0),
    discount: Joi.number().default(0),
    issuers: Joi.string().allow(''),
    datePublic: Joi.string().allow(''),
    bookSize: Joi.string().allow(''),
    coverType: Joi.string().allow(''),
    pagesNumber: Joi.string().allow(''),
    sku: Joi.string().allow(''),
    bookMass: Joi.string().allow(''),
    createdAt: Joi.date().timestamp().default(getCurrentDate()),
    updatedAt: Joi.date().timestamp().default(null),
    isAvailable: Joi.boolean().default(true),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    try {
        const validated = await schema.validateAsync(data, { abortEarly: false })
        return validated
    } catch (error) {
        return ({ err: 'Kiểm tra sách thất bại: ' + error })
    }
}

const getAll = async () => {
    try {
        const data = await getDB().collection('products').find().toArray()
        return data
    } catch (error) {
        return ({ err: 'Lấy tất cả sách thất bại: ' + error })
    }
}

const getOne = async (id) => {
    try {
        const data = await getDB().collection('products').findOne({ bookid: id })
        if (!data) {
            return ({ err: 'Không tìm thấy BookID' })
        }
        return data
    } catch (error) {
        return ({ err: `Lấy bookID:${id} thất bại: ` + error })
    }
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const all = await getDB().collection('products').find().toArray()
        for (let i = 0; i < all.length; i++) {
            if (data.bookid === all[i].bookid) {
                return ({ err: 'Tạo sách thất bại (productID đã tồn tại)!' })
            }
        }
        if (!value.err) {
            await getDB().collection('products').insertOne(value)
            return ({ message: 'Tạo sách thành công' })
        }
        return ({ err: 'Tạo sách thất bại: ' + value.err })
    } catch (error) {
        return ({ err: 'Tạo sách thất bại: ' + error })
    }
}

const updateOne = async (id, data) => {
    try {
        const existed = await getDB().collection('products').findOne({ bookid: id })
        if (!existed) {
            return ({ err: 'Không tìm thấy BookID' })
        }
        const condition = Joi.object({
            bookname: Joi.string().min(2),
            price: Joi.number(),
            image: Joi.string(),
            category: Joi.string(),
            supplier: Joi.string().allow(''),
            author: Joi.string(),
            description: Joi.string().allow(''),
            inStock: Joi.number().allow(''),
            purchased: Joi.number().allow(''),
            discount: Joi.number().allow(''),
            issuers: Joi.string().allow(''),
            datePublic: Joi.string().allow(''),
            bookSize: Joi.string().allow(''),
            coverType: Joi.string().allow(''),
            pagesNumber: Joi.string().allow(''),
            bookMass: Joi.string().allow(''),
            isAvailable: Joi.boolean(),
            updatedAt: Joi.date().timestamp(),
            _destroy: Joi.boolean()
        })
        let value
        try {
            if (Object.keys(data).length === 0) {
                return ({ err: 'Không thể cập nhật sách vì dữ liệu rỗng' })
            }
            value = await condition.validateAsync(data, { abortEarly: false })
        } catch (error) {
            return ({ err: `Kiểm tra bookID:${id}  thất bại: ` + error })
        }
        await getDB().collection('products').updateOne({ bookid: id }, { $set: value })
        await getDB().collection('products').updateOne({ bookid: id }, { $set: { updatedAt: getCurrentDate() } })
        return ({ message: `Cập nhật bookID:${id} thành công` })
    } catch (error) {
        return ({ err: `Cập nhật bookID:${id} thất bại: ` + error })
    }
}

const deleteOne = async (id) => {
    try {
        try {
            const data = await getDB().collection('products').findOne({ bookid: id })
            await getDB().collection('products').deleteOne({ bookid: data.bookid })
            return ({ message: `Xóa bookID:${id} thành công` })
        } catch (error) {
            return ({ err: 'Không tìm thấy BookID' })
        }
    } catch (error) {
        return ({ err: `Xóa bookID:${id} thất bại: ` + error })
    }
}

export const ProductModel = { createNew, getAll, getOne, updateOne, deleteOne }