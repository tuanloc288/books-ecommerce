import signIn from "./signIn"
import axiosInstance from "../../../components/others/axiosInstance"

export const signOut = async (dispatch) => {
    try {
        const msg = await axiosInstance.post('signForm/signOut')
        if(msg.data.message){
            dispatch(signIn.actions.signOut())
        }
    } catch (error) {
        return error
    }
}

