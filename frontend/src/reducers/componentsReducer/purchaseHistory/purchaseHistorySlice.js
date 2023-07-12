import { createSlice} from '@reduxjs/toolkit'

const initialState = {
    billList: [],
    bilLDetailList: [],
    billID: ''
}
 export default  createSlice({
    name: 'purchaseHistory',
    initialState,
    reducers: {
        setBillList: (state,action) => {
            state.billList = action.payload
        },
        setBillDetailList: (state, action) => {
            state.bilLDetailList = action.payload
        },
        setBillID: (state, action) => {
            state.billID = action.payload
        }
    }
})