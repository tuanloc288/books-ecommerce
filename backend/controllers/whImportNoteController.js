import { ImportNoteModel } from "../models/whImportNoteModel.js" 

const getAllImportNotes = async (req, res) => {
   try {
        const data = await ImportNoteModel.getAll()
        res.status(200).json(data)
   } catch (error) {
        res.status(500).json(error)
   }
}

const getOneImportNote = async (req, res) => {
    try {
        const data = await ImportNoteModel.getOne(req.params.id)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
}

const createImportNote = async (req, res) => {
  try {
    const newImportNote = await ImportNoteModel.createNew(req.body)
    res.status(201).json(newImportNote)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateOneImportNote = async (req, res) => {
    try {
        const updatedImportNote = await ImportNoteModel.updateOne(req.params.id , req.body)
        res.status(200).json(updatedImportNote)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteOneImportNote = async (req, res) => {
    try {
        const deletedImportNote = await ImportNoteModel.deleteOne(req.params.id)
        res.status(200).json(deletedImportNote)
    } catch ({error}) {
        res.status(500).json(error)
    }
}

export const ImportNoteController = { getAllImportNotes, getOneImportNote , createImportNote , updateOneImportNote , deleteOneImportNote}