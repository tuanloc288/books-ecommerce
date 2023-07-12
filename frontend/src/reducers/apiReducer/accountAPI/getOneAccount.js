import axiosInstance from "../../../components/others/axiosInstance";


export const getOneAccount = async (props) => {
    try {
        const res = await axiosInstance.get(`account/${props.userName}`)
        return res.data
    } catch (error) {
        return error
    }
}