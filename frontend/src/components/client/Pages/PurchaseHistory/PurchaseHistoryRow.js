import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import purchaseHistorySlice from '../../../../reducers/componentsReducer/purchaseHistory/purchaseHistorySlice'
import { toMoney } from '../../../others/utilsAPI'
import { billAPI } from '../../../../reducers/apiReducer/billAPI'
import { billDetailAPI } from '../../../../reducers/apiReducer/billDetailAPI'
import { refreshTokenHandler } from '../../../../reducers/apiReducer/signFormAPI/refreshToken'
import confirmDialogSlice from '../../../../reducers/componentsReducer/confirmDialog/confirmDialogSlice'
import { useEffect, useState } from 'react'

const PurchaseHistoryRow = (props) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.signIn.data)
    const detailList = useSelector(state => state.purchaseHistory.bilLDetailList)
    const billList = useSelector(state => state.purchaseHistory.billList)
    const dialog = useSelector(state => state.confirmDialog.confirmation)
    const [deleteID, setDeleteID] = useState('')

    const handleDetail = (id) => {
        document.getElementById('purchase-history-detail-wrapper').classList.add('showModal')
        document.getElementById('purchase-history-detail-container').classList.add('showModal')
        document.body.classList.add('modal-open')
        dispatch(purchaseHistorySlice.actions.setBillID(id))
    }

    const handleDelete = async (id, status) => {
        if(status.includes('Chưa xử lý')){
            dispatch(confirmDialogSlice.actions.setConfirmDialog({show: true, title: 'Bạn có chắc muốn hủy đơn hàng không?', res: false}))
        }
        else {
            toast.error('Không thể hủy đơn khi đơn hàng đã được xử lý!' , {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                pauseOnFocusLoss: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })
        }
    }

    useEffect(() => {
        if(dialog.res && dialog.title !== '' && deleteID === props.data.billID) {
            dispatch(confirmDialogSlice.actions.setConfirmDialog({show: false, title: '', res: false}))
            setDeleteID('')
            toast.success('Xóa thành công!' , {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                pauseOnFocusLoss: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })
            document.body.classList.remove('modal-open')
            let deleting = async () => {
                let newToken = await refreshTokenHandler(user.accessToken, dispatch)
                await billAPI.deleteBill({billID: props.data.billID, accessToken: newToken})
                let books = JSON.parse(localStorage.getItem("books"))
                for(let i in detailList[props.data.billID]){
                    for(let y in books){
                        if(books[y].bookid === detailList[props.data.billID][i].productID){
                            books[y].purchased = (books[y].purchased - detailList[props.data.billID][i].quantity) < 0 ? 0 : (books[y].purchased - detailList[props.data.billID][i].quantity)
                            break
                        }
                    }
                    await billDetailAPI.deleteBillDetail({billDetailID: detailList[props.data.billID][i].billDetailID, accessToken: newToken})
                }
                localStorage.setItem("books", JSON.stringify(books))
                let newBillList = billList.filter(item => item.billID !== props.data.billID)
                dispatch(purchaseHistorySlice.actions.setBillList(newBillList))
                let local = []
                for(let i in newBillList){
                    let detail = await (billDetailAPI.getBillDetail({billID: newBillList[i].billID, accessToken: newToken}))
                    local[newBillList[i].billID] = detail
                }
                dispatch(purchaseHistorySlice.actions.setBillDetailList(local))

            } 
            deleting()
        }
    }, [dialog])

    return (
        <>
            <tr className='purchase-history-record'>
                <td> {props.data.billID.split('-')[1]} </td>    
                <td> {props.data.address} </td>    
                <td> {props.data.orderDate} </td>    
                <td> {props.data.handleDate} </td>    
                <td> 
                    {props.data.status}
                </td>    
                <td> 
                    <button className='purchase-history-bill-detail' onClick={() => handleDetail(props.data.billID)}>
                        Chi tiết  
                    </button>
                </td>    
                <td> {toMoney(props.data.totalAmount)}đ </td>
                {
                    props.data.status.includes('Chưa xử lý') 
                    ? <td onClick={() => {
                        handleDelete(props.data.billID, props.data.status)
                        setDeleteID(props.data.billID)
                    }}> <i className="fa-solid fa-trash able"></i> </td>    
                    : <td onClick={() => handleDelete(props.data.billID, props.data.status)}> <i className="fa-solid fa-trash unable"></i> </td>    
                }
            </tr>
        </>
    )
}

export default PurchaseHistoryRow