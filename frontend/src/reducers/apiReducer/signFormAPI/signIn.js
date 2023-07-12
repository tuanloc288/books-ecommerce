import { createSlice ,createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../components/others/axiosInstance'

export const signIn = createAsyncThunk('signForm/signIn', async (props) => {
    try {
        const res = await axiosInstance.post('signForm/signIn', props, {
            withCredentials: true
        })
        return res.data
    } catch (error) {
        return error.response.data
    }
})

const initialState = {
    isLoading: false,
    data: {},
    error: ''
}

 export default createSlice({
    name: 'signIn',
    initialState,
    reducers: {
        signOut: (state) => {
            state.data = {}
        },
        updateToken: (state, action) => {
            state.data.accessToken = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signIn.pending, (state,action) => {
            state.isLoading = true
        })
        builder.addCase(signIn.fulfilled, (state, action) => {
            state.isLoading = false
            state.data = action.payload
            state.error = ''
        })
        builder.addCase(signIn.rejected, (state,action) => {
            state.isLoading = false
            state.data = {}
            state.error = action.error.message
        })
    }
})