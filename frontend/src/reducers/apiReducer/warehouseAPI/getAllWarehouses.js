import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../components/others/axiosInstance'

export const fetchAllWarehouses = createAsyncThunk(
    "warehouseAPI/fetchAllWarehouses",
    async (accessToken) => {
        try {
            const res = await axiosInstance.get(`whImportNote`, {
                headers: {
                    token: "Bearer " + accessToken,
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
    warehousesList: [],
    error: '',
}
export default createSlice({
    name: 'getWarehouses',
    initialState,
    reducers:
    {
        removeWarehouse: (state, action) => {
            state.warehousesList = state.warehousesList.filter((item) => item.importNoteID !== action.payload);
            return state;
        },
        updateWarehouse: (state, action) => {
            const warehouseUpdate = action.payload
            state.warehousesList.map((item) => {
                if (item.importNoteID === warehouseUpdate.importNoteID) {
                    Object.assign(item, warehouseUpdate);
                    return state;
                }
            })
        },
        addWarehouse: (state, action) => {
            state.warehousesList.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllWarehouses.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(fetchAllWarehouses.fulfilled, (state, action) => {
            state.isLoading = false
            state.warehousesList = action.payload
            state.cusWarehousesList = action.payload.filter(item => item.isAvailable && !item._destroy)
            state.error = ''
        })
        builder.addCase(fetchAllWarehouses.rejected, (state, action) => {
            state.isLoading = false
            state.warehousesList = []
            state.error = action.error.message
        })
    }
})