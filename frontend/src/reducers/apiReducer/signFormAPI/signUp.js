import { createSlice ,createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../components/others/axiosInstance'

export const signUp = createAsyncThunk('signForm/signUp', async (props) => {
    const res = await axiosInstance.post('signForm/signUp', props)
    return res.data
}) 

const initialState = {
    isLoading: false,
    data: {},
    error: ''
}

 export default createSlice({
    name: 'signUp',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(signUp.pending, (state,action) => {
            state.isLoading = true
        })
        builder.addCase(signUp.fulfilled, (state, action) => {
            state.isLoading = false
            state.data = action.payload
            state.error = ''
        })
        builder.addCase(signUp.rejected, (state,action) => {
            state.isLoading = false
            state.data = {}
            state.error = action.error.message
        })
    }
})