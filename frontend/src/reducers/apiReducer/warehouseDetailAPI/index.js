import axiosInstance from '../../../components/others/axiosInstance'

export const createWhDetail = async (props) => {
    try {
        const res = await axiosInstance.post('importNoteDetail', props.data, {
            headers: {
                token: "Bearer " + props.accessToken,
            },
        });
        return res.data

    } catch (error) {
        return error;
    }
}

export const deleteWhDetail = async (props) => {
    try {
        const res = await axiosInstance.delete(`importNoteDetail/${props.importNoteDetailID}`, {
            headers: {
                token: "Bearer " + props.accessToken
            }
        })
        return res.data
    } catch (error) {
        return error
    }
}