import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    selected: {},
}

export default createSlice({
    name: 'categories',
    initialState,
    reducers: {
        selectedCategory: (state, action) => {
            state.selected = action.payload;
        },
    },
})


