import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from "../../../components/others/axiosInstance";

export const updateAccount = createAsyncThunk('accountAPI/updateAccount', async (props) => {
    const res = await axiosInstance.put(`account/${props.userName}`, props.data)
    return res.data
}) 

const initialState = {
    isLoading: false,
    data: {},
    error: ''
}
 export default createSlice({
    name: 'updateAccount',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(updateAccount.pending, (state,action) => {
            state.isLoading = true
        })
        builder.addCase(updateAccount.fulfilled, (state, action) => {
            state.isLoading = false
            state.data = action.payload
            state.error = ''
        })
        builder.addCase(updateAccount.rejected, (state,action) => {
            state.isLoading = false
            state.data = {}
            state.error = action.error.message
        })
    }
})