import { DiscountOnAccountModel } from "../models/discountOnAccountModel.js" 

const getAllDiscountOnAccount = async (req, res) => {
   try {
        const data = await DiscountOnAccountModel.getAll()
        res.status(200).json(data)
   } catch (error) {
        res.status(500).json(error)
   }
}

const getOneDiscountOnAccount = async (req, res) => {
  try {
    const data = await DiscountOnAccountModel.getOne(req.params.id)
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error)
  }
}

const createDiscountOnAccount = async (req, res) => {
  try {
    const newDiscountOnAccount = await DiscountOnAccountModel.createNew(req.body)
    res.status(201).json(newDiscountOnAccount)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateOneDiscountOnAccount = async (req , res) => {
    try {
      const updateDiscountOnAccount = await DiscountOnAccountModel.updateOne(req.params.id , req.body)
      res.status(200).json(updateDiscountOnAccount)
    } catch (error) {
      res.status(500).json(error)
    }
}

const updateDestroy = async (req,res) => {
  try {
    const updatedDestroy = await DiscountOnAccountModel.updateDestroy()
    res.status(200).json(updatedDestroy)
  } catch (error) {
    res.status(500).json(error)
  }
}

const deleteOneDiscountOnAccount = async (req, res) => {
    try {
        const deletedDiscountOnAccount = await DiscountOnAccountModel.deleteOne(req.params.id)
        res.status(200).json(deletedDiscountOnAccount)
    } catch ({error}) {
        res.status(500).json(error)
    }
}

export const DiscountOnAccountController = { getAllDiscountOnAccount , getOneDiscountOnAccount ,createDiscountOnAccount, updateOneDiscountOnAccount, updateDestroy , deleteOneDiscountOnAccount}