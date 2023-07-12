import { PrivilegedModel } from "../models/privilegedModel.js" 

const getAllPrivileged = async (req, res) => {
   try {
        const data = await PrivilegedModel.getAll()
        res.status(200).json(data)
   } catch (error) {
        res.status(500).json(error)
   }
}

const getOnePrivileged = async (req, res) => {
    try {
        const data = await PrivilegedModel.getOne(req.params.id)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
}

const createPrivileged = async (req, res) => {
  try {
    const newPrivileged = await PrivilegedModel.createNew(req.body)
    res.status(201).json(newPrivileged)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateOnePrivileged = async (req, res) => {
    try {
        const updatedPrivileged = await PrivilegedModel.updateOne(req.params.id , req.body)
        res.status(200).json(updatedPrivileged)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteOnePrivileged = async (req, res) => {
    try {
        const deletedPrivileged = await PrivilegedModel.deleteOne(req.params.id)
        res.status(200).json(deletedPrivileged)
    } catch ({error}) {
        res.status(500).json(error)
    }
}

export const PrivilegedController = { getAllPrivileged, getOnePrivileged , createPrivileged , updateOnePrivileged , deleteOnePrivileged}