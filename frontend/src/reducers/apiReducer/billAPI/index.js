import axiosInstance from '../../../components/others/axiosInstance'

const createBill = async (props) => {
    try {
        const res = await axiosInstance.post('bill', props.data, {
            headers: {
                token: "Bearer " + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
}

const getBillByUser = async (props) => {
    try {
        const res = await axiosInstance.get(`bill/${props.userName}`, {
            headers: {
                token: "Bearer " + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
}

const updateBill = async (props) => {
    try {
        const res = await axiosInstance.put(`bill/${props.billID}`, props.data, {
            headers: {
                token: "Bearer " + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
}

const deleteBill = async (props) => {
    try {
        const res = await axiosInstance.delete(`bill/${props.billID}`, {
            headers: {
                token: "Bearer " + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
}

export const billAPI = { createBill, getBillByUser, updateBill, deleteBill } 