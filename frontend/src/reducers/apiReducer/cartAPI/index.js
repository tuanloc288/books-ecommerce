import axiosInstance from '../../../components/others/axiosInstance'

export const createCart = async (props) => {
    try {
        const res = await axiosInstance.post('cart', props)
        return res.data
    } catch (error) {
        return error
    }
} 

export const getOneCart = async (props) => {
    try {
        const res = await axiosInstance.get(`cart/${props.cartID}`)
        return res.data
    } catch (error) {
        return error
    }
}

export const updateCart = async (props) => {
    try {
        const res = await axiosInstance.put(`cart/${props.cartID}`, props.data)
        return res.data    
    } catch (error) {
        return error
    }
}

export const deleteCart = async (props) => {
    try {
        const res = await axiosInstance.delete(`cart/${props.cartID}`)
        return res.data        
    } catch (error) {
        return error
    }
} 

export const cartAPI = {createCart , getOneCart, updateCart , deleteCart} 