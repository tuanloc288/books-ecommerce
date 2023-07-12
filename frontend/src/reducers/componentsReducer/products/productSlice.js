import { createSlice } from '@reduxjs/toolkit'
import { removeVietnameseTones } from '../../../components/others/utilsAPI'
const initialState = {
    selected: {},
    filterProductsList: [],
    categoryProductsList: [],
    searchProductsList: [],
    displayList: [],
    totalPages: 0,
    displayPerPage: 16,
    basicSort: 'default',
    productsHeader: 'Tất cả',
    perRow: 'auto auto auto auto',
    // dat
    productsCheckedRemove: [],
    filterProducts: [],
    filterByCate: 'All',
    filterByStatus: 'All',
    filterByBookName: '',
    filterByAuthor: '',
    filterByMinPrice: 0,
    filterByMaxPrice: 1000000000,
    isFilter: false,
    isCheckedDesProduct: false,
}
export default createSlice({
    name: 'products',
    initialState,
    reducers: {
        selectedProduct: (state, action) => {
            state.selected = action.payload
        },
        removeSelectedProduct: (state) => {
            state.selected = {}
        },
        setFilterList: (state, action) => {
            state.filterProductsList = action.payload
            state.totalPages = Math.ceil(action.payload.length / state.displayPerPage)
        },
        setCategoryProductsList: (state, action) => {
            state.categoryProductsList = action.payload
            state.filterProductsList = action.payload
            state.totalPages = Math.ceil(action.payload.length / state.displayPerPage)
        },
        setSearchResult: (state, action) => {
            state.searchProductsList = action.payload
            if (action.payload.length !== 0) {
                state.filterProductsList = action.payload
                state.totalPages = Math.ceil(action.payload.length / state.displayPerPage)
            }
        },
        setDisplayList: (state, action) => {
            state.displayList = action.payload
        },
        setBasicSort: (state, action) => {
            state.basicSort = action.payload
        },
        setProductsHeader: (state, action) => {
            state.productsHeader = action.payload
        },
        setPerRow: (state, action) => {
            state.perRow = action.payload
        },
        // dat
        setProductsCheckedRemove: (state, action) => {
            state.productsCheckedRemove = [...state.productsCheckedRemove, action.payload];
        },
        removeElementProductsChecked: (state, action) => {
            state.productsCheckedRemove = state.productsCheckedRemove.filter(item => item.bookid !== action.payload);
            return state;
        },
        clearProductsCheckedRemove: (state) => {
            state.productsCheckedRemove = [];
        },
        setFilterProducts: (state, action) => {
            state.isFilter = true;
            var productsList = action.payload;
            if (state.filterByCate === 'All') {
                if (state.filterByStatus === 'All') {
                    productsList = productsList.filter(item => removeVietnameseTones(item.bookname).toLowerCase().includes(state.filterByBookName) &&
                        removeVietnameseTones(item.author).toLowerCase().includes(state.filterByAuthor.toLowerCase())
                        && (item.isAvailable.toString() === 'true' || item.isAvailable.toString() === 'false') &&
                        item.price > parseInt(state.filterByMinPrice) && item.price < parseInt(state.filterByMaxPrice))
                }
                else {
                    productsList = productsList.filter(item => removeVietnameseTones(item.bookname).toLowerCase().includes(state.filterByBookName) &&
                        removeVietnameseTones(item.author).toLowerCase().includes(state.filterByAuthor.toLowerCase()) &&
                        item.isAvailable.toString() === state.filterByStatus &&
                        item.price > parseInt(state.filterByMinPrice) && item.price < parseInt(state.filterByMaxPrice))
                }
            }
            else {
                if (state.filterByStatus === 'All') {
                    productsList = productsList.filter(item => removeVietnameseTones(item.bookname).toLowerCase().includes(state.filterByBookName) &&
                        removeVietnameseTones(item.author).toLowerCase().includes(state.filterByAuthor) &&
                        item.category.includes(state.filterByCate) && (item.isAvailable.toString() === 'true' || item.isAvailable.toString() === 'false') &&
                        item.price > state.filterByMinPrice && item.price < parseInt(state.filterByMaxPrice))
                }
                else {
                    productsList = productsList.filter(item => removeVietnameseTones(item.bookname).toLowerCase().includes(state.filterByBookName) &&
                        removeVietnameseTones(item.author).toLowerCase().includes(state.filterByAuthor) &&
                        item.category.includes(state.filterByCate) && item.isAvailable.toString() === state.filterByStatus &&
                        item.price > state.filterByMinPrice && item.price < parseInt(state.filterByMaxPrice))
                }
            }
            state.filterProducts = productsList;
        },

        clearFilterProducts: (state) => {
            state.filterByStatus = 'All'
            state.filterByAuthor = '';
            state.filterByBookName = '';
            state.filterByCate = 'All';
            state.filterByMaxPrice = 1000000000;
            state.filterByMinPrice = 0;
            state.filterProducts = [];
            state.isFilter = false;
            state.isCheckedDesProduct = false;
        },
        removeElementFilterProducts: (state, action) => {
            state.filterProducts = state.filterProducts.filter(item => item.bookid !== action.payload);
            return state;
        },
        setFilterByBookName: (state, action) => {
            state.filterByBookName = action.payload;
        },
        setFilterByAuthor: (state, action) => {
            state.filterByAuthor = action.payload;
        },
        setFilterByMinPrice: (state, action) => {
            state.filterByMinPrice = action.payload;
        },
        setFilterByMaxPrice: (state, action) => {
            state.filterByMaxPrice = action.payload;
        },
        setFilterByCate: (state, action) => {
            state.filterByCate = action.payload;
        },
        setFilterByStatus: (state, action) => {
            state.filterByStatus = action.payload;
        },
        setFilterByProductDestroy: (state, action) => {
            const productList = action.payload;
            state.isCheckedDesProduct = true;
            state.isFilter = true;
            state.filterProducts = productList.filter(item => item._destroy === true);
        },
        clearOnlyFilterProducts: (state) => {
            state.isFilter = false;
            state.isCheckedDesProduct = false;
            state.filterProducts = [];
        },
    }
})