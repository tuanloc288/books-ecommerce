import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../components/others/axiosInstance'

export const fetchAllDoA = createAsyncThunk(
    "DoAAPI/fetchAllDoA",
    async (accessToken) => {
        try {
            const res = await axiosInstance.get(`discountOnAccount`, {
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
    DoAList: [],
    error: '',
}
export default createSlice({
    name: 'getAllDoA',
    initialState,
    reducers:
    {
        removeDoA: (state, action) => {
            state.DoAList = state.DoAList.filter((item) => item.DoAID !== action.payload);
            return state;
        },
        updateDoA: (state, action) => {
            const DoAUpdate = action.payload
            state.DoAList.map((item) => {
                if (item.DoAID === DoAUpdate.DoAID) {
                    Object.assign(item, DoAUpdate);
                    return state;
                }
            })
        },
        addDoA: (state, action) => {
            state.DoAList.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllDoA.fulfilled, (state, action) => {
            state.DoAList = action.payload
            state.error = ''
        })
        builder.addCase(fetchAllDoA.rejected, (state, action) => {
            state.DoAList = []
            state.error = action.error.message
        })
    }
})