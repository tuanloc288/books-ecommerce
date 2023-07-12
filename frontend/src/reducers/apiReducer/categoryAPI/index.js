import axiosInstance from "../../../components/others/axiosInstance";

export const createCategory = async (props) => {
    try {
        const res = await axiosInstance.post('category', props.data, {
            headers: {
                token: "Bearer " + props.accessToken,
            },
        });
        return res.data

    } catch (error) {
        return error;
    }
}

export const deleteCategory = async (props) => {
    try {
        const res = await axiosInstance.delete(`category/${props.categoryID}`, {
            headers: {
                token: "Bearer " + props.accessToken,
            },
        });
        return res.data
    } catch (error) {
        return error;
    }
}

export const updateCategory = async (props) => {
    try {
        const res = await axiosInstance.put(`category/${props.categoryID}`, props.data, {
            headers: {
                token: "Bearer " + props.accessToken,
            },
        });
        return res.data
    } catch (error) {
        return error;
    }
}

