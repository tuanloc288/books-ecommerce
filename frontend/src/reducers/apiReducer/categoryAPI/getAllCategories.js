import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../components/others/axiosInstance'

export const fetchAllCategories = createAsyncThunk('categoryAPI/fetchAllCategory', async () => {
    const res = await axiosInstance.get('category')
    return res.data
})

const initialState = {
    isLoading: true,
    categoriesList: [],
    error: '',
}
export default createSlice({
    name: 'getCategories',
    initialState,
    reducers: {
        removeCategory: (state, action) => {
            state.categoriesList = state.categoriesList.filter((item) => item.categoryID !== action.payload);
            return state;
        },
        updateCategory: (state, action) => {
            const categoryUpdate = action.payload
            state.categoriesList.map((item) => {
                if (item.categoryID === categoryUpdate.categoryID) {
                    Object.assign(item, categoryUpdate);
                    return state;
                }
            })
        },
        addCategory: (state, action) => {
            state.categoriesList.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllCategories.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
            state.isLoading = false
            state.categoriesList = action.payload
            state.error = ''
        })
        builder.addCase(fetchAllCategories.rejected, (state, action) => {
            state.isLoading = false
            state.categoriesList = []
            state.error = action.error.message
        })
    }
})