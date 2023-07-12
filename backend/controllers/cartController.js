import { CartModel } from "../models/cartModel.js" 

const getAllCarts = async (req, res) => {
   try {
        const data = await CartModel.getAll()
        res.status(200).json(data)
   } catch (error) {
        res.status(500).json(error)
   }
}

const getOneCart = async (req, res) => {
    try {
        const data = await CartModel.getOne(req.params.id)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
}

const createCart = async (req, res) => {
  try {
    const newCart = await CartModel.createNew(req.body)
    res.status(201).json(newCart)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateOneCart = async (req, res) => {
    try {
        const updatedCart = await CartModel.updateOne(req.params.id , req.body)
        res.status(200).json(updatedCart)
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateCartUser = async (req, res) => {
    try {
        const updatedCart = await CartModel.updateUserName(req.body.user , req.body.oldUser)
        res.status(200).json(updatedCart)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteOneCart = async (req, res) => {
    try {
        const deletedCart = await CartModel.deleteOne(req.params.id)
        res.status(200).json(deletedCart)
    } catch ({error}) {
        res.status(500).json(error)
    }
}

export const CartController = { getAllCarts, getOneCart , createCart , updateOneCart, updateCartUser , deleteOneCart}