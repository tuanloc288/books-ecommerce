import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    labelList:[],
    cateList: {
        cateListQuantity: [],
        cateListTotal: [],
    },
    selected: {},
}


export default createSlice({
    name: 'cateMgmt',
    initialState,
    reducers: {
        selectedCategory: (state, action) => {
            state.selected = action.payload;
        },
        setLabelList: (state , action) => {
            state.labelList = action.payload
        },
        setCateList: (state, action) => {
            state.cateList = action.payload;
        },
    },
})