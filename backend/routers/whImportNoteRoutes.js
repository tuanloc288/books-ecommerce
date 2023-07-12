import express from "express";
import { ImportNoteController } from "../controllers/whImportNoteController.js"; 

const router = express.Router()

router.route('/')
    .get(ImportNoteController.getAllImportNotes)
    .post(ImportNoteController.createImportNote)

router.route('/:id')
    .get(ImportNoteController.getOneImportNote)
    .put(ImportNoteController.updateOneImportNote)
    .delete(ImportNoteController.deleteOneImportNote)


export const importNoteRoutes = router