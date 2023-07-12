import { createSlice} from '@reduxjs/toolkit'

const initialState = {
    selected: {}
}
 export default  createSlice({
    name: 'home',
    initialState,
    reducers: {
        selectedProduct: (state,action) => {
            state.selected = action.payload
        },
        removeSelectedProduct: (state) => {
            state.selected = {}
        }
    }
})