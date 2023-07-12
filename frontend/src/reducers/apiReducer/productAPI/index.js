import axiosInstance from "../../../components/others/axiosInstance";

export const createProduct = async (props) => {
    try {
        const res = await axiosInstance.post('product', props.data, {
            headers: {
                token: "Bearer " + props.accessToken,
            },
        });
        return res.data

    } catch (error) {
        return error;
    }
}

export const deleteProduct = async (props) => {
    try {
        const res = await axiosInstance.delete(`product/${props.bookid}`,{
            headers: {
                token: "Bearer " + props.accessToken,
            },
        });
        return res.data
    } catch (error) {
        return error;
    }
}

export const updateProduct = async (props) => {
    try {
        const res = await axiosInstance.put(`product/${props.bookid}`, props.data, {
            headers: {
                token: "Bearer " + props.accessToken,
            },
        });
        return res.data
    } catch (error) {
        return error;
    }
}
