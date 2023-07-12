import { BillModel } from "../models/billModel.js" 

const getAllBills = async (req, res) => {
   try {
        const data = await BillModel.getAll()
        res.status(200).json(data)
   } catch (error) {
        res.status(500).json(error)
   }
}

const getOneBill = async (req, res) => {
    try {
        const data = await BillModel.getOne(req.params.id)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
}

const createBill = async (req, res) => {
  try {
    const newBill = await BillModel.createNew(req.body)
    res.status(201).json(newBill)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateOneBill = async (req, res) => {
    try {
        const updatedBill = await BillModel.updateOne(req.params.id , req.body)
        res.status(200).json(updatedBill)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteOneBill = async (req, res) => {
    try {
        const deletedBill = await BillModel.deleteOne(req.params.id)
        res.status(200).json(deletedBill)
    } catch ({error}) {
        res.status(500).json(error)
    }
}

export const BillController = { getAllBills, getOneBill , createBill , updateOneBill , deleteOneBill}