import { fetchAllAccounts } from '../../reducers/apiReducer/accountAPI/getAllAccounts'
import { fetchAllProducts } from '../../reducers/apiReducer/productAPI/getAllProducts'
import { fetchAllCategories } from '../../reducers/apiReducer/categoryAPI/getAllCategories'
import { fetchAllBills } from '../../reducers/apiReducer/billAPI/getAllBills'
import { fetchAllWarehouses } from '../../reducers/apiReducer/warehouseAPI/getAllWarehouses'
import { fetchAllPrivileged } from '../../reducers/apiReducer/privilegedAPI/getAllPrivileged'
import { fetchAllDoA } from '../../reducers/apiReducer/discountOnAccountAPI/getAllDoA'
import { fetchAllDoC } from '../../reducers/apiReducer/discountOnCategoryAPI/getAllDoC'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { refreshTokenHandler } from '../../reducers/apiReducer/signFormAPI/refreshToken'
import { billAPI } from '../../reducers/apiReducer/billAPI'
import { billDetailAPI } from '../../reducers/apiReducer/billDetailAPI'
import getAllBills from '../../reducers/apiReducer/billAPI/getAllBills'
import purchaseHistorySlice from '../../reducers/componentsReducer/purchaseHistory/purchaseHistorySlice'

const FetchAllData = () => {
    const productsList = useSelector((state) => state.getProducts.productsList)
    const categoriesList = useSelector((state) => state.getCategories.categoriesList)
    const accountsList = useSelector((state) => state.getAccounts.accountsList)
    const signInData = useSelector((state) => state.signIn.data)
    const billList = useSelector((state) => state.purchaseHistory.billList)
    const billsList = useSelector((state) => state.getBills.billsList);
    const warehouseList = useSelector((state) => state.getWarehouses.warehousesList)
    const privilegedList = useSelector(state => state.getPrivileged.privilegedList)
    const DoAList = useSelector(state => state.getAllDoA.DoAList)
    // const DoCList = useSelector(state => state.getAllDoC.DoCList)
    const dispatch = useDispatch()

    useEffect(() => {
        if (productsList.length === 0) {
            dispatch(fetchAllProducts())
        }
        if (categoriesList.length === 0) {
            dispatch(fetchAllCategories())
        }
        // for bill ctm list
        if (signInData.accessToken) {
            let handleAsync = async () => {
                let newToken = await refreshTokenHandler(signInData.accessToken, dispatch)
                let list = await billAPI.getBillByUser({ userName: signInData.user.userName, accessToken: newToken })
                if (!list.err) {
                    dispatch(purchaseHistorySlice.actions.setBillList(list))
                    let local = []
                    for (let i in list) {
                        let detail = await (billDetailAPI.getBillDetail({ billID: list[i].billID, accessToken: newToken }))
                        local[list[i].billID] = detail
                    }
                    dispatch(purchaseHistorySlice.actions.setBillDetailList(local))
                }
            }
            handleAsync()
        }
        if(signInData.accessToken && signInData.isAdmin){
            dispatch(fetchAllAccounts(signInData.accessToken))
            dispatch(fetchAllBills(signInData.accessToken))
            dispatch(fetchAllWarehouses(signInData.accessToken))
            dispatch(fetchAllPrivileged(signInData.accessToken))
            dispatch(fetchAllDoA(signInData.accessToken))
            // dispatch(fetchAllDoC(signInData.accessToken))
            // if (accountsList.length === 0) {
            // }
            // if (billsList.length === 0) {
            // }
            // if (warehouseList.length === 0) {
            // }
            // if (privilegedList.length === 0) {
            // }
            // if(DoAList.length === 0){
            // }
            // if(DoCList.length === 0){
            // }
        }
    }, [signInData])

    useEffect(() => {
        if (productsList.length !== 0) {
            localStorage.setItem('books', JSON.stringify(productsList))
        }
        if (billsList.length !== 0 && warehouseList.length !== 0) {
            let local = []
            let handleAsync = async () => {
                let newToken = await refreshTokenHandler(signInData.accessToken, dispatch)
                
                // for bill mgmt list
                for (let i in billsList) {
                    let detail = await (billDetailAPI.getBillDetail({ billID: billsList[i].billID, accessToken: newToken }))
                    local[billsList[i].billID] = detail
                }
                dispatch(getAllBills.actions.setBillDetailList(local))
            }
            handleAsync()
        }
    }, [productsList, billsList, warehouseList])
}

export default FetchAllData