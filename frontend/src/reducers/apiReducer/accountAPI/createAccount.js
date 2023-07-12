import axiosInstance from "../../../components/others/axiosInstance";

export const createAccount = async (props) => {
    try {
        const res = await axiosInstance.post('account', props.data, {
            headers: {
                token: 'Bearer ' + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
} 