import axiosInstance from "../../../components/others/axiosInstance";

export const updatePrivileged = async (props) => {
    try {
        const res = await axiosInstance.put(`privileged/${props.privilegedID}`, props.data, {
            headers: {
                token: 'Bearer ' + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
}