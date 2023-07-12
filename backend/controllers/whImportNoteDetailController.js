import { ImportNoteDetailModel } from "../models/whImportNoteDetailModel.js" 

const getAllImportNoteDetails = async (req, res) => {
   try {
        const data = await ImportNoteDetailModel.getAll(req.params.id)
        res.status(200).json(data)
   } catch (error) {
        res.status(500).json(error)
   }
}

const createImportNoteDetail = async (req, res) => {
  try {
    const newImportNoteDetail = await ImportNoteDetailModel.createNew(req.body)
    res.status(201).json(newImportNoteDetail)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateImportNoteDetail = async (req, res) => {
    try {
        const updated = await ImportNoteDetailModel.updateOne(req.params.id, req.body)
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json(error)
    }
} 

const updateDestroyImportNoteDetail = async (req, res) => {
    try {
        const destroyed = await ImportNoteDetailModel.updateDestroy(req.params.id, req.body)
        res.status(200).json(destroyed)
    } catch (error) {
        res.status(500).json(error)
    }
} 

const deleteOneImportNoteDetail = async (req, res) => {
    try {
        const deletedImportNoteDetail = await ImportNoteDetailModel.deleteOne(req.params.id)
        res.status(200).json(deletedImportNoteDetail)
    } catch ({error}) {
        res.status(500).json(error)
    }
}

export const ImportNoteDetailController = { getAllImportNoteDetails , createImportNoteDetail, updateImportNoteDetail, updateDestroyImportNoteDetail , deleteOneImportNoteDetail}