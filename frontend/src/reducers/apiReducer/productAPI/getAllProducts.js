import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../components/others/axiosInstance'

export const fetchAllProducts = createAsyncThunk('productAPI/fetchAllProducts', async () => {
    const res = await axiosInstance.get('product')
    return res.data
})

const initialState = {
    isLoading: true,
    productsList: [],
    cusProductsList: [],
    error: '',
}
export default createSlice({
    name: 'getProducts',
    initialState,
    reducers:
    {
        removeProduct: (state, action) => {
            state.productsList = state.productsList.filter((item) => item.bookid !== action.payload);
            return state;
        },
        updateProduct: (state, action) => {
            const productUpdate = action.payload
            state.productsList.map((item) => {
                if (item.bookid === productUpdate.bookid) {
                    Object.assign(item, productUpdate);
                    return state;
                }
            })
        },
        addProduct: (state, action) => {
            state.productsList.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllProducts.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
            state.isLoading = false
            state.productsList = action.payload
            state.cusProductsList = action.payload.filter(item => item.isAvailable && !item._destroy)
            state.error = ''
        })
        builder.addCase(fetchAllProducts.rejected, (state, action) => {
            state.isLoading = false
            state.productsList = []
            state.error = action.error.message
        })
    }
})