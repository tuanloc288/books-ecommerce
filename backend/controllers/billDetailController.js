import { BillDetailModel } from "../models/billDetailModel.js" 

const getAllBillDetails = async (req, res) => {
   try {
        const data = await BillDetailModel.getAll(req.params.id)
        res.status(200).json(data)
   } catch (error) {
        res.status(500).json(error)
   }
}

const createBillDetail = async (req, res) => {
  try {
    const newBillDetail = await BillDetailModel.createNew(req.body)
    res.status(201).json(newBillDetail)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateDestroyBillDetail = async (req, res) => {
    try {
        const destroyed = await BillDetailModel.updateDestroy(req.params.id, req.body)
        res.status(200).json(destroyed)
    } catch (error) {
        res.status(500).json(error)
    }
} 

const deleteOneBillDetail = async (req, res) => {
    try {
        const deletedBillDetail = await BillDetailModel.deleteOne(req.params.id)
        res.status(200).json(deletedBillDetail)
    } catch ({error}) {
        res.status(500).json(error)
    }
}

export const BillDetailController = { getAllBillDetails , createBillDetail, updateDestroyBillDetail , deleteOneBillDetail}