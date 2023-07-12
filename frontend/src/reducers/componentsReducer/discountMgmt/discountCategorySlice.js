
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    formType: '',
    formData: {},
    showForm: false,
    showDes: false,
    filterList: []
}


export default createSlice({
    name: 'discountCategoryMgmt',
    initialState,
    reducers: {
        setForm: (state, action) => {
            state.formType = action.payload.type;
            state.formData = action.payload.data;
            state.showForm = action.payload.show;
        },
        setShowDes: (state, action) => {
            state.showDes = action.payload
        },
        setFilterList: (state, action) => {
            state.filterList = action.payload
        },
    },
})