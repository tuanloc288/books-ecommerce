import { AccountModel } from "../models/accountModel.js" 

const getAllAccounts = async (req, res) => {
   try {
        const data = await AccountModel.getAll()
        res.status(200).json(data)
   } catch (error) {
        res.status(500).json(error)
   }
}

const getOneAccount = async (req, res) => {
    try {
        const data = await AccountModel.getOne(req.params.id)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
}

const createAccount = async (req, res) => {
  try {
    const newAccount = await AccountModel.createNew(req.body)
    res.status(201).json(newAccount)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateOneAccount = async (req, res) => {
    try {
        const updatedAccount = await AccountModel.updateOne(req.params.id , req.body)
        res.status(200).json(updatedAccount)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteOneAccount = async (req, res) => {
    try {
        const deletedAccount = await AccountModel.deleteOne(req.params.id)
        res.status(200).json(deletedAccount)
    } catch ({error}) {
        res.status(500).json(error)
    }
}

export const AccountController = { getAllAccounts, getOneAccount , createAccount , updateOneAccount , deleteOneAccount}