import { DiscountOnCategoryModel } from "../models/discountOnCategoryModel.js" 

const getAllDiscountOnCategory = async (req, res) => {
   try {
        const data = await DiscountOnCategoryModel.getAll()
        res.status(200).json(data)
   } catch (error) {
        res.status(500).json(error)
   }
}

const createDiscountOnCategory = async (req, res) => {
  try {
    const newDiscountOnCategory = await DiscountOnCategoryModel.createNew(req.body)
    res.status(201).json(newDiscountOnCategory)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateOneDiscountOnCategory = async (req , res) => {
    try {
      const updateDiscountOnCategory = await DiscountOnCategoryModel.updateOne(req.params.id , req.body)
      res.status(200).json(updateDiscountOnCategory)
    } catch (error) {
      res.status(500).json(error)
    }
}

const updateDestroy = async (req,res) => {
  try {
    const updatedDestroy = await DiscountOnCategoryModel.updateDestroy()
    res.status(200).json(updatedDestroy)
  } catch (error) {
    res.status(500).json(error)
  }
}

const deleteOneDiscountOnCategory = async (req, res) => {
    try {
        const deletedDiscountOnCategory = await DiscountOnCategoryModel.deleteOne(req.params.id)
        res.status(200).json(deletedDiscountOnCategory)
    } catch ({error}) {
        res.status(500).json(error)
    }
}

export const DiscountOnCategoryController = { getAllDiscountOnCategory , createDiscountOnCategory, updateOneDiscountOnCategory, updateDestroy , deleteOneDiscountOnCategory}