import axiosInstance from "../../../components/others/axiosInstance"

const getBillDetail = async (props) => {
    try {
        const res = await axiosInstance.get(`billDetail/${props.billID}`, {
            headers: {
                token: "Bearer " + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
}

const createBillDetail = async (props) => {
    try {
        const res = await axiosInstance.post('billDetail', props.data, {
            headers: {
                token: "Bearer " + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
}

const deleteBillDetail = async (props) => {
    try {
        const res = await axiosInstance.delete(`billDetail/${props.billDetailID}`, {
            headers: {
                token: "Bearer " + props.accessToken
            }
        })
        return res.data        
    } catch (error) {
        return error
    }
} 

export const billDetailAPI = {createBillDetail , getBillDetail , deleteBillDetail}