import { createSlice ,createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../components/others/axiosInstance'

export const sendMail = createAsyncThunk('signForm/sendMail', async (props) => {
    try {
        const res = await axiosInstance.post('signForm/sendMail', props)
        return res.data
    } catch (error) {
        return error.response.data
    }
}) 

const initialState = {
    isLoading: false,
    data: {},
    error: '',
}

 export default createSlice({
    name: 'sendMail',
    initialState,
    reducers: {
        clearMailData: (state) => {
            state.data = {}
        }
    },
    extraReducers: (builder) => {
        builder.addCase(sendMail.pending, (state,action) => {
            state.isLoading = true
        })
        builder.addCase(sendMail.fulfilled, (state, action) => {
            state.isLoading = false
            state.data = action.payload
            state.error = ''
        })
        builder.addCase(sendMail.rejected, (state,action) => {
            state.isLoading = false
            state.data = {}
            state.error = action.error.message
        })
    }
})