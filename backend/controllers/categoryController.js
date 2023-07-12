import { CategoryModel } from "../models/categoryModel.js" 

const getAllCategories = async (req, res) => {
   try {
        const data = await CategoryModel.getAll()
        res.status(200).json(data)
   } catch (error) {
        res.status(500).json(error)
   }
}

const getOneCategory = async (req, res) => {
    try {
        const data = await CategoryModel.getOne(req.params.id)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
}

const createCategory = async (req, res) => {
  try {
    const newCategory = await CategoryModel.createNew(req.body)
    res.status(201).json(newCategory)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateOneCategory = async (req, res) => {
    try {
        const updatedCategory = await CategoryModel.updateOne(req.params.id , req.body)
        res.status(200).json(updatedCategory)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteOneCategory = async (req, res) => {
    try {
        const deletedCategory = await CategoryModel.deleteOne(req.params.id)
        res.status(200).json(deletedCategory)
    } catch ({error}) {
        res.status(500).json(error)
    }
}

export const CategoryController = { getAllCategories, getOneCategory , createCategory , updateOneCategory , deleteOneCategory}