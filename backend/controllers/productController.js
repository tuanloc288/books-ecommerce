import { ProductModel } from "../models/productModel.js"

const getAllProducts = async (req, res) => {
   res.send(await ProductModel.getAll())
}

const getOneProduct = async (req, res) => {
  try {
    const data = await ProductModel.getOne(req.params.id)
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error)
  }
}

const createProduct = async (req, res) => {
  try {
    const newProduct = await ProductModel.createNew(req.body)
    res.status(201).json(newProduct)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateOneProduct = async (req , res) => {
  try {
    const updatedProduct = await ProductModel.updateOne(req.params.id , req.body)
    res.status(200).json(updatedProduct)
  } catch (error) {
    res.status(500).json(error)
  }
}

const deleteOneProduct = async (req, res) => {
  try {
    const deletedProduct = await ProductModel.deleteOne(req.params.id)
    res.status(200).json(deletedProduct)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const ProductController = { getAllProducts, getOneProduct , createProduct, updateOneProduct, deleteOneProduct }
