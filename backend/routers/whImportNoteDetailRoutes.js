import express from "express";
import { ImportNoteDetailController } from "../controllers/whImportNoteDetailController.js"; 

const router = express.Router()

router.route('/')
    .post(ImportNoteDetailController.createImportNoteDetail)

router.route('/:id')
    .get(ImportNoteDetailController.getAllImportNoteDetails)
    .put(ImportNoteDetailController.updateImportNoteDetail)
    .delete(ImportNoteDetailController.deleteOneImportNoteDetail)

router.route('/destroy/:id')
    .put(ImportNoteDetailController.updateDestroyImportNoteDetail)


export const importNoteDetailRoutes = router