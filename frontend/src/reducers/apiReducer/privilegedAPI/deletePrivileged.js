import axiosInstance from "../../../components/others/axiosInstance";

export const deletePrivileged = async (props) => {
    try {
        const res = await axiosInstance.delete(`privileged/${props.privilegedID}`,{
            headers: {
                token: "Bearer " + props.accessToken,
            },
        });
        return res.data
    } catch (error) {
        return error;
    }
}