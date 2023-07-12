import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    selected: {},
    warehousesCheckedRemove: [],
    filterWarehouses: [],
    action: '',
    isFilter: false,
    isCheckedDesWarehouse: false,
    filterByID: '',
    filterByFromCreateDate: '',
    filterByToCreateDate: '',
}

export default createSlice({
    name: 'warehouses',
    initialState,
    reducers: {
        selectedWarehouse: (state, action) => {
            state.selected = action.payload;
        },
        removeSelectedWarehouse: (state) => {
            state.selected = {}
        },
        setWarehousesCheckedRemove: (state, action) => {
            state.warehousesCheckedRemove = [...state.warehousesCheckedRemove, action.payload];
        },
        removeElementWarehousesChecked: (state, action) => {
            state.warehousesCheckedRemove = state.warehousesCheckedRemove.filter(item => item.importNoteID !== action.payload);
            return state;
        },
        clearWarehousesCheckedRemove: (state) => {
            state.warehousesCheckedRemove = [];
        },
        setFilterWarehouses: (state, action) => {
            var warehousesList = action.payload;
            state.isFilter = true;
            warehousesList = warehousesList.filter(item => item.importNoteID.toLowerCase().includes(state.filterByID));
            if (state.filterByFromCreateDate !== '') {
                warehousesList = warehousesList.filter(item => Date.parse(item.createdAt.slice(0, item.createdAt.indexOf(' '))) >= state.filterByFromCreateDate)
            }
            if (state.filterByToCreateDate !== '') {
                warehousesList = warehousesList.filter(item => Date.parse(item.createdAt.slice(0, item.createdAt.indexOf(' '))) <= state.filterByToCreateDate)
            }
            state.filterWarehouses = warehousesList
        },
        removeElementFilterWarehouses: (state, action) => {
            state.filterWarehouses = state.filterWarehouses.filter(item => item.importNoteID !== action.payload);
            return state;
        },
        setFilterByWarehouseDestroy: (state, action) => {
            const WarehouseList = action.payload;
            state.isFilter = true;
            state.isCheckedDesWarehouse = true;
            state.filterWarehouses = WarehouseList.filter(item => item._destroy === true);
        },
        clearFilterWarehouses: (state) => {
            state.filterBills = '';
            state.filterByFromCreateDate = '';
            state.filterByToCreateDate = '';
            state.filterWarehouses = [];
            state.isFilter = false;
            state.isCheckedDesWarehouse = false;
            state.actionUpdate = '';
        },
        setAction: (state, action) => {
            state.action = action.payload
        },
        clearAction: (state) => {
            state.action = ''
        },
        setFilterByID: (state, action) => {
            state.filterByID = action.payload
        },
        setFilterByFromCreateDate: (state, action) => {
            state.filterByFromCreateDate = action.payload
        },
        setFilterByToCreateDate: (state, action) => {
            state.filterByToCreateDate = action.payload
        },

    },
})


