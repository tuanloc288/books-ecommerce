import { CartDetailModel } from "../models/cartDetailModel.js" 

const getAllCartDetails = async (req, res) => {
   try {
        const data = await CartDetailModel.getAll(req.params.id)
        res.status(200).json(data)
   } catch (error) {
        res.status(500).json(error)
   }
}

const createCartDetail = async (req, res) => {
  try {
    const newCartDetail = await CartDetailModel.createNew(req.body)
    res.status(201).json(newCartDetail)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateCartDetail = async (req, res) => {
    try {
        const updated = await CartDetailModel.updateOne(req.params.id, req.body)
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json(error)
    }
} 

const deleteOneCartDetail = async (req, res) => {
    try {
        const deletedCartDetail = await CartDetailModel.deleteOne(req.params.id)
        res.status(200).json(deletedCartDetail)
    } catch ({error}) {
        res.status(500).json(error)
    }
}

export const CartDetailController = { getAllCartDetails , createCartDetail, updateCartDetail , deleteOneCartDetail}