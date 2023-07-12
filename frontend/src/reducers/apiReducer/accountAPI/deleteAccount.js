import axiosInstance from "../../../components/others/axiosInstance";

export const deleteAccount = async (props) => {
    try {
        const res = await axiosInstance.delete(`account/${props.userName}`,{
            headers: {
                token: "Bearer " + props.accessToken,
            },
        });
        return res.data
    } catch (error) {
        return error;
    }
}