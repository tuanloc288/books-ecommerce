import { createSlice} from '@reduxjs/toolkit'

const initialState = {
    confirmation: {
        show: false,
        title: '',
        res: false
    }
}
 export default  createSlice({
    name: 'confirmDialog',
    initialState,
    reducers: {
        setConfirmDialog: (state,action) => {
            state.confirmation = action.payload
        }
    }
})