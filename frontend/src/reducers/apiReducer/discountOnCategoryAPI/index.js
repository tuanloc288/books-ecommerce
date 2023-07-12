import axiosInstance from "../../../components/others/axiosInstance"

const updateDestroyDiscount = async (props) => {
    try {
        const res = await axiosInstance.put('discountOnCategory' , {
            headers: {
                token: "Bearer " + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
}

const updateOneDoC = async (props) => {
    try {
        const res = await axiosInstance.put(`discountOnCategory/${props.DoCID}`, props.data, {
            headers: {
                token: "Bearer " + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
}

const deleteDoC = async (props) => {
    try {
        const res = await axiosInstance.delete(`discountOnCategory/${props.DoCID}`,{
            headers: {
                token: "Bearer " + props.accessToken,
            },
        });
        return res.data
    } catch (error) {
        return error;
    }
}

const createDoC = async (props) => {
    try {
        const res = await axiosInstance.post('discountOnCategory', props.data, {
            headers: {
                token: 'Bearer ' + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
} 

export const discountCategoryAPI = { createDoC, deleteDoC ,updateOneDoC, updateDestroyDiscount }