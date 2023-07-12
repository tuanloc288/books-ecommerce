import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    filterDisplay: false,
}


export default createSlice({
    name: 'mergeMgmt',
    initialState,
    reducers: {
        setFilterDisplay: (state, action) => {
            state.filterDisplay = action.payload;
        }
    }
})