import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    formType: '',
    formData: {},
    showForm: false,
    filterList: []
}

export default createSlice({
    name: 'privilegedMgmt',
    initialState,
    reducers: {
        setForm: (state, action) => {
            state.formType = action.payload.type;
            state.formData = action.payload.data;
            state.showForm = action.payload.show;
        },
        setFilterList: (state, action) => {
            state.filterList = action.payload
        },
    },
})