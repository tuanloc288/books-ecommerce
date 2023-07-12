import { createSlice} from '@reduxjs/toolkit'

const initialState = {
    cartList: []
}
 export default  createSlice({
    name: 'carts',
    initialState,
    reducers: {
        setCartList: (state,action) => {
            state.cartList = action.payload
        }
    }
})