import axiosInstance from '../../../components/others/axiosInstance'

export const createCartDetail = async (props) => {
    try {
        const res = await axiosInstance.post('cartDetail', props)
        return res.data
    } catch (error) {
        return error
    }
}

export const getCartDetail = async (props) => {
    try {
        const res = await axiosInstance.get(`cartDetail/${props.cartID}`)
        return res.data
    } catch (error) {
        return error
    }
}

export const updateCartDetail = async (props) => {
    try {
        const res = await axiosInstance.put(`cartDetail/${props.cartDetailID}`, props.data)
        return res.data
    } catch (error) {
        return error
    }
}

export const deleteCartDetail = async (props) => {
    try {
        const res = await axiosInstance.delete(`cartDetail/${props.cartDetailID}`)
        return res.data        
    } catch (error) {
        return error
    }
} 

export const cartDetailAPI = { createCartDetail, getCartDetail , updateCartDetail, deleteCartDetail }