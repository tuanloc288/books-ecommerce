import { createSlice} from '@reduxjs/toolkit'

const initialState = {
    firstSectionList: {},
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    pieYear: new Date().getFullYear()
}
 export default  createSlice({
    name: 'statisticMgmt',
    initialState,
    reducers: {
        setFirstSection: (state,action) => {
            state.firstSectionList = action.payload
        },
        setThirdSection: (state,action) => {
            state.thirdSectionList = action.payload
        },
        setMonth: (state,action) => {
            state.month = action.payload
        },
        setYear: (state,action) => {
            state.year = action.payload
        },
        setPieYear: (state,action) => {
            state.pieYear = action.payload
        }
    }
})