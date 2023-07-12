import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from "../../../components/others/axiosInstance";

export const fetchAllDoC = createAsyncThunk(
    "DoCAPI/fetchAllDoC",
    async (accessToken) => {
        try {
            const res = await axiosInstance.get(`discountOnCategory`, {
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
    DoCList: [],
    error: '',
}
export default createSlice({
    name: 'getAllDoC',
    initialState,
    reducers:
    {
        removeDoC: (state, action) => {
            state.DoCList = state.DoCList.filter((item) => item.DoCID !== action.payload);
            return state;
        },
        updateDoC: (state, action) => {
            const DoCUpdate = action.payload
            state.DoCList.map((item) => {
                if (item.DoCID === DoCUpdate.DoCID) {
                    Object.assign(item, DoCUpdate);
                    return state;
                }
            })
        },
        addDoC: (state, action) => {
            state.DoCList.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllDoC.fulfilled, (state, action) => {
            state.DoCList = action.payload
            state.error = ''
        })
        builder.addCase(fetchAllDoC.rejected, (state, action) => {
            state.DoCList = []
            state.error = action.error.message
        })
    }
})