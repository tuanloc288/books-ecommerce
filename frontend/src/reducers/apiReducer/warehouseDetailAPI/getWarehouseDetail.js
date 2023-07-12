import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../components/others/axiosInstance'

export const fetchAllWarehouseDetails = createAsyncThunk(
    "warehouseDetailAPI/fetchAllWarehouseDetails",
    async (props) => {
        try {
            const res = await axiosInstance.get(`importNoteDetail/${props.importNoteID}`, {
                headers: {
                    token: "Bearer " + props.accessToken,
                },
            });
            return res.data;
        } catch (error) {
            return error;
        }
    }
);

const initialState = {
    isLoading: true,
    warehouseDetailsList: [],
    error: '',
}
export default createSlice({
    name: 'getWarehouseDetails',
    initialState,
    reducers:
    {
        clearWarehouseDetail: (state) => {
            state.warehouseDetailsList = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllWarehouseDetails.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(fetchAllWarehouseDetails.fulfilled, (state, action) => {
            state.isLoading = false
            state.warehouseDetailsList = action.payload
            state.error = ''
        })
        builder.addCase(fetchAllWarehouseDetails.rejected, (state, action) => {
            state.isLoading = false
            state.warehouseDetailsList = []
            state.error = action.error.message
        })
    }
})