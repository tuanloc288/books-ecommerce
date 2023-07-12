import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    selected: {},
    billsCheckedRemove: [],
    filterBills: [],
    filterByBillID: '',
    filterByStatus: 'All',
    filterByUserName: '',
    filterByFromOrderDate: '',
    filterByToOrderDate: '',
    filterByFromHandleDate: '',
    filterByToHandleDate: '',
    isFilter: false,
    isCheckedDesBill: false,
    action: '',
}

export default createSlice({
    name: 'bills',
    initialState,
    reducers: {
        selectedBill: (state, action) => {
            state.selected = action.payload;
        },
        removeSelectedBill: (state) => {
            state.selected = {}
        },
        setBillsCheckedRemove: (state, action) => {
            state.billsCheckedRemove = [...state.billsCheckedRemove, action.payload];
        },
        removeElementBillsChecked: (state, action) => {
            state.billsCheckedRemove = state.billsCheckedRemove.filter(item => item.billID !== action.payload);
            return state;
        },
        clearBillsCheckedRemove: (state) => {
            state.billsCheckedRemove = [];
        },
        setFilterBills: (state, action) => {
            state.isFilter = true;
            var temp = action.payload;
            if (state.filterByStatus === 'All') {
                temp = temp.filter(item => item.billID.includes(state.filterByBillID) &&
                    item.userName.includes(state.filterByUserName))
                if (state.filterByFromOrderDate !== '') {
                    temp = temp.filter(item => Date.parse(item.orderDate.slice(0, item.orderDate.indexOf(' '))) >= state.filterByFromOrderDate)
                }
                if (state.filterByToOrderDate !== '') {
                    temp = temp.filter(item => Date.parse(item.orderDate.slice(0, item.orderDate.indexOf(' '))) <= state.filterByToOrderDate)
                }
                if (state.filterByFromHandleDate !== '') {
                    temp = temp.filter(item => Date.parse(item.handleDate.slice(0, item.handleDate.indexOf(' '))) >= state.filterByFromHandleDate)
                }
                if (state.filterByToHandleDate !== '') {
                    temp = temp.filter(item => Date.parse(item.handleDate.slice(0, item.handleDate.indexOf(' '))) <= state.filterByToHandleDate)
                }
                state.filterBills = temp;
            }
            else {
                temp = temp.filter(item => item.billID.includes(state.filterByBillID) &&
                    item.userName.includes(state.filterByBillID) && item.status === state.filterByStatus)
                if (state.filterByFromOrderDate !== '') {
                    temp = temp.filter(item => Date.parse(item.orderDate.slice(0, item.orderDate.indexOf(' '))) >= state.filterByFromOrderDate)
                }
                if (state.filterByToOrderDate !== '') {
                    temp = temp.filter(item => Date.parse(item.orderDate.slice(0, item.orderDate.indexOf(' '))) <= state.filterByToOrderDate)
                }
                if (state.filterByFromHandleDate !== '') {
                    temp = temp.filter(item => Date.parse(item.handleDate.slice(0, item.handleDate.indexOf(' '))) >= state.filterByFromHandleDate)
                }
                if (state.filterByToHandleDate !== '') {
                    temp = temp.filter(item => Date.parse(item.handleDate.slice(0, item.handleDate.indexOf(' '))) <= state.filterByToHandleDate)
                }
                state.filterBills = temp;
            }
        },
        removeElementFilterBills: (state, action) => {
            state.filterBills = state.filterBills.filter(item => item.billID !== action.payload);
            return state;
        },
       
        clearFilterBills: (state) => {
            state.filterBills = '';
            state.filterByBillID = '';
            state.filterByStatus = 'All';
            state.filterByUserName = '';
            state.filterByFromOrderDate = '';
            state.filterByToOrderDate = '';
            state.filterByFromHandleDate = '';
            state.filterByToHandleDate = '';
            state.filterBills = [];
            state.isFilter = false;
            state.isCheckedDesBill = false;
            state.action = '';
        },
        setFilterByBillID: (state, action) => {
            state.filterByBillID = action.payload;
        },
        setFilterByStatus: (state, action) => {
            state.filterByStatus = action.payload;
        },
        setFilterByUserName: (state, action) => {
            state.filterByUserName = action.payload;
        },
        setFilterByFromOrderDate: (state, action) => {
            state.filterByFromOrderDate = action.payload;
        },
        setFilterByToOrderDate: (state, action) => {
            state.filterByToOrderDate = action.payload;
        },
        setFilterByFromHandleDate: (state, action) => {
            state.filterByFromHandleDate = action.payload;
        },
        setFilterByToHandleDate: (state, action) => {
            state.filterByToHandleDate = action.payload;
        },
        setFilterByBillDestroy: (state, action) => {
            const billList = action.payload;
            state.isCheckedDesBill = true;
            state.isFilter = true;
            state.filterBills = billList.filter(item => item._destroy === true);
        },
        clearOnlyFilterBills: (state) => {
            state.isFilter = false;
            state.isCheckedDesBill = false;
            state.filterBills = [];
        },
        setAction: (state, action) => {
            state.action = action.payload;
        },
        clearAction: (state) => {
            state.action = '';
        }
    },
})


