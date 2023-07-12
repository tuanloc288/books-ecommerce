import axiosInstance from "../../../components/others/axiosInstance";

export const createWarehouse = async (props) => {
    try {
        const res = await axiosInstance.post('whImportNote', props.data, {
            headers: {
                token: "Bearer " + props.accessToken,
            },
        });
        return res.data

    } catch (error) {
        return error;
    }
}

export const deleteWarehouse = async (props) => {
    try {
        const res = await axiosInstance.delete(`whImportNote/${props.importNoteID}`, {
            headers: {
                token: "Bearer " + props.accessToken,
            },
        });
        return res.data
    } catch (error) {
        return error;
    }
}

export const updateWarehouse = async (props) => {
    try {
        const res = await axiosInstance.put(`whImportNote/${props.importNoteID}`, props.data, {
            headers: {
                token: "Bearer " + props.accessToken,
            },
        });
        return res.data
    } catch (error) {
        return error;
    }
}
