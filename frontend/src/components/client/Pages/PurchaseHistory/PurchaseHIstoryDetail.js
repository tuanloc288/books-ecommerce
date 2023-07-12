import './purchaseHistory.css' 
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toMoney } from '../../../others/utilsAPI'
import purchaseHistorySlice from '../../../../reducers/componentsReducer/purchaseHistory/purchaseHistorySlice'


const PurchaseHistoryDetail = () => {
    const dispatch = useDispatch()
    const detail = useSelector(state => state.purchaseHistory.bilLDetailList)
    const billID = useSelector(state => state.purchaseHistory.billID)
    const productsList = useSelector((state) => state.getProducts.cusProductsList)

    useEffect(() => {
        const ele = document.getElementById('purchase-history-detail-wrapper') 
        ele.addEventListener('mouseup' , handleClickOutside)
        return () => ele.removeEventListener('mouseup', handleClickOutside)
    }, [])
    
    const handleClickOutside = () => {
        const ele = document.getElementById('purchase-history-detail-wrapper') 
        let container = document.getElementById('purchase-history-detail-container')
        ele.addEventListener('mouseup' , (e) => {
            if(!container.contains(e.target)){
                ele.classList.remove('showModal')
                container.classList.remove('showModal')
                document.body.classList.remove('modal-open')
                dispatch(purchaseHistorySlice.actions.setBillID(''))
            }
        } , {once: true})
    }
    
    const handleCloseDetail= () => {
        document.getElementById('purchase-history-detail-wrapper').classList.remove('showModal')
        document.getElementById('purchase-history-detail-container').classList.remove('showModal')
        document.body.classList.remove('modal-open')
    }

    useEffect(() => {
    }, [detail, billID])

    return (
            <div id="purchase-history-detail-container">
                <div id='purchase-history-detail-header'>
                    <div>
                        {billID}
                    </div>
                    <i className='fas fa-times' id='purchase-history-detail-close' onClick={handleCloseDetail}></i>
                </div>
                <div id="purchase-history-detail-content">

                    <div className='purchase-history-detail-row'>
                        <span> Tên </span>
                        <span> Giá </span>
                    </div>

                    <div id='purchase-history-detail-scroll' className='purchase-history-detail-underline'>
                       
                        {
                            billID !== '' ? (
                                detail[billID]?.length !== 0 ? (
                                    detail[billID]?.map((item) => {
                                        return (
                                            <div key={item.productID} className='purchase-history-detail-row'>
                                                <span className='purchase-history-detail-normal'> {item.quantity}x {
                                                    productsList.map(product => {
                                                        if(product.bookid === item.productID){
                                                            return product.bookname
                                                        }
                                                    })
                                                }</span>
                                                <span className='purchase-history-detail-normal'> {toMoney(item.totalAmount)}đ </span>
                                            </div>
                                        )
                                    })
                                ) : null
                            ) : null
                        }
                        
                    </div>

                    <div className='purchase-history-detail-row'>
                        <span> Giá gốc </span>
                        <span className='purchase-history-detail-normal' style={{ color: 'red'}}> {
                            billID !== '' ? (
                                detail[billID]?.length !== 0 ? (
                                    toMoney(detail[billID]?.reduce((total, {totalAmount}) => total + totalAmount, 0)) + 'đ'
                                ) : '0đ'
                            ) : '0đ'
                            } </span>
                    </div>

                    <div className='purchase-history-detail-row purchase-history-detail-underline'>
                        <span> Khuyến mãi </span>
                        <span className='purchase-history-detail-normal' style={{ color: 'green'}}> {
                            billID !== '' ? (
                                detail[billID]?.length !== 0 ? (
                                    '-' + toMoney(detail[billID]?.reduce((total, {totalAmount, discount}) => total + (totalAmount * discount), 0)) + 'đ'
                                ) : '0đ'
                            ) : '0đ'
                            } </span>
                    </div>
                    
                    <div className='purchase-history-detail-row'>
                        <span> Thành tiền </span>
                        <span className='purchase-history-detail-normal' style={{ color: '#FAAB9F'}}> {
                            billID !== '' ? (
                                detail[billID]?.length !== 0 ? (
                                    toMoney(detail[billID]?.reduce((total, {totalAmount, discount}) => total + (totalAmount - (totalAmount * discount)), 0)) + 'đ'
                                ) : '0đ'
                            ) : '0đ'
                            } </span>
                    </div>
                </div>
            </div>
    )
}

export default PurchaseHistoryDetail