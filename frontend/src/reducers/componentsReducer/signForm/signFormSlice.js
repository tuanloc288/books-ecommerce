import { createSlice} from '@reduxjs/toolkit'

const initialState = {
    isSignUp: false,
    isForgotPassword: false,
    isVerifyEmail: false,
    isVerification: false,
    formData: {},
    verificationMessage: {}
}
 export default  createSlice({
    name: 'signForm',
    initialState,
    reducers: {
        switchForm: (state,action) => {
            state.isSignUp = action.payload
        },
        forgotPassword: (state,action) => {
            state.isForgotPassword = action.payload
        },
        verifyEmail: (state,action) => {
            state.isVerifyEmail = action.payload
        },
        verifyClick: (state,action) => {
            state.isVerification = action.payload
        },
        setFormData: (state,action) => {
            state.formData = action.payload
        },
        setVerificationMsg: (state,action) => {
            state.verificationMessage = action.payload
        }
    }
})