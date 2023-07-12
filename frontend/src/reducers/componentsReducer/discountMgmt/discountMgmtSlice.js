import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    filterDisplay: false,
}

export default createSlice({
    name: 'discountMgmt',
    initialState,
    reducers: {
        setFilterDisplay: (state, action) => {
            state.filterDisplay = action.payload;
        }
    }
})