import { configureStore } from "@reduxjs/toolkit";
import getAllProducts from './apiReducer/productAPI/getAllProducts'
import getAllAccounts from "./apiReducer/accountAPI/getAllAccounts";
import getAllCategories from "./apiReducer/categoryAPI/getAllCategories";
import getAllBills from "./apiReducer/billAPI/getAllBills";
import getAllBillDetails from "./apiReducer/billDetailAPI/getAllBillDetails";
import getAllWarehouses from "./apiReducer/warehouseAPI/getAllWarehouses";
import getAllPrivileged from "./apiReducer/privilegedAPI/getAllPrivileged";
import getAllDoA from "./apiReducer/discountOnAccountAPI/getAllDoA";
import getAllDoC from "./apiReducer/discountOnCategoryAPI/getAllDoC";
import confirmDialogSlice from "./componentsReducer/confirmDialog/confirmDialogSlice";
import productSlice from "./componentsReducer/products/productSlice";
import signFormSlice from "./componentsReducer/signForm/signFormSlice";
import cartSlice from "./componentsReducer/carts/cartSlice";
import billSlice from "./componentsReducer/bills/billSlice";
import warehouseSlice from "./componentsReducer/warehouses/warehouseSlice";
import sendMail from "./apiReducer/signFormAPI/sendMail";
import signUp from "./apiReducer/signFormAPI/signUp";
import signIn from "./apiReducer/signFormAPI/signIn";
import purchaseHistorySlice from "./componentsReducer/purchaseHistory/purchaseHistorySlice";
import updateAccount from "./apiReducer/accountAPI/updateAccount";
import cateMgmtSlice from "./componentsReducer/categoryMgmt/categoryMgmtSlice";
import mergeMgmtSlice from "./componentsReducer/mergeMgmt/mergeMgmtSlice";
import accountMgmtSlice from "./componentsReducer/accountMgmt/accountMgmtSlice";
import privilegedMgmtSlice from "./componentsReducer/privilegedMgmt/privilegedMgmtSlice";
import getWarehouseDetail from "./apiReducer/warehouseDetailAPI/getWarehouseDetail";
import discountMgmtSlice from "./componentsReducer/discountMgmt/discountMgmtSlice";
import discountAccountMgmtSlice  from './componentsReducer/discountMgmt/discountAccountSlice'
import discountCategoryMgmtSlice  from './componentsReducer/discountMgmt/discountCategorySlice'
import statisticMgmtSlice from "./componentsReducer/statisticMgmt/statisticMgmtSlice";

export const store = configureStore({
    reducer: {
        getProducts: getAllProducts.reducer,
        getAccounts: getAllAccounts.reducer,
        getCategories: getAllCategories.reducer,
        getWarehouses: getAllWarehouses.reducer,
        getBills: getAllBills.reducer,
        getWhDetail: getWarehouseDetail.reducer,
        getBillDetails: getAllBillDetails.reducer,
        getPrivileged: getAllPrivileged.reducer,
        getAllDoA: getAllDoA.reducer,
        getAllDoc: getAllDoC.reducer,
        updateAccount: updateAccount.reducer,
        signForm: signFormSlice.reducer,
        sendMail: sendMail.reducer,
        signUp: signUp.reducer,
        signIn: signIn.reducer,
        products: productSlice.reducer,
        carts: cartSlice.reducer,
        purchaseHistory: purchaseHistorySlice.reducer,
        bills: billSlice.reducer,
        warehouses: warehouseSlice.reducer,
        confirmDialog: confirmDialogSlice.reducer,
        cateMgmt: cateMgmtSlice.reducer,
        mergeMgmt: mergeMgmtSlice.reducer,
        accountMgmt: accountMgmtSlice.reducer,
        privilegedMgmt: privilegedMgmtSlice.reducer,
        discountMgmt: discountMgmtSlice.reducer,
        discountAccountMgmt: discountAccountMgmtSlice.reducer,
        discountCategoryMgmt: discountCategoryMgmtSlice.reducer,
        statisticMgmt: statisticMgmtSlice.reducer
    }
})

export default store