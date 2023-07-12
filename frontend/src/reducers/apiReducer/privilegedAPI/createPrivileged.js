import axiosInstance from "../../../components/others/axiosInstance";

export const createPrivileged = async (props) => {
    try {
        const res = await axiosInstance.post('privileged', props.data, {
            headers: {
                token: 'Bearer ' + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
} 