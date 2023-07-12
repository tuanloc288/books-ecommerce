import axiosInstance from "../../../components/others/axiosInstance"

const getDiscountByUser = async (props) => {
    try {
        const res = await axiosInstance.get(`discountOnAccount/${props.userName}`, {
            headers: {
                token: "Bearer " + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
}

const updateDestroyDiscount = async (props) => {
    try {
        const res = await axiosInstance.put('discountOnAccount' , {
            headers: {
                token: "Bearer " + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
}

const updateOneDoA = async (props) => {
    try {
        const res = await axiosInstance.put(`discountOnAccount/${props.DoAID}`, props.data, {
            headers: {
                token: "Bearer " + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
}

const deleteDoA = async (props) => {
    try {
        const res = await axiosInstance.delete(`discountOnAccount/${props.DoAID}`,{
            headers: {
                token: "Bearer " + props.accessToken,
            },
        });
        return res.data
    } catch (error) {
        return error;
    }
}

const createDoA = async (props) => {
    try {
        const res = await axiosInstance.post('discountOnAccount', props.data, {
            headers: {
                token: 'Bearer ' + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
} 

export const discountAccountAPI = { getDiscountByUser, updateDestroyDiscount, updateOneDoA, createDoA, deleteDoA }