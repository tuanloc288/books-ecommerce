import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../components/others/axiosInstance'

export const fetchAllBills = createAsyncThunk(
    "billAPI/fetchAllBills",
    async (accessToken) => {
        try {
            const res = await axiosInstance.get(`bill`, {
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
    billsList: [],
    billDetailList: [],
    error: '',
}
export default createSlice({
    name: 'getBills',
    initialState,
    reducers:
    {
        removeBill: (state, action) => {
            state.billsList = state.billsList.filter((item) => item.billID !== action.payload);
            return state;
        },
        updateBill: (state, action) => {
            const billUpdate = action.payload
            state.billsList.map((item) => {
                if (item.billID === billUpdate.billID) {
                    Object.assign(item, billUpdate);
                    return state;
                }
            })
        },
        addBill: (state, action) => {
            state.billsList.push(action.payload);
        },
        setBillDetailList: (state, action) => {
            state.billDetailList = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllBills.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(fetchAllBills.fulfilled, (state, action) => {
            state.isLoading = false
            state.billsList = action.payload
            state.error = ''
        })
        builder.addCase(fetchAllBills.rejected, (state, action) => {
            state.isLoading = false
            state.billsList = []
            state.error = action.error.message
        })
    }
})