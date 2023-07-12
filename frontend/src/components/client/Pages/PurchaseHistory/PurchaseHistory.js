import {  useEffect } from 'react'
import {  useSelector } from 'react-redux'
import './purchaseHistory.css'
import PurchaseHistoryDetail from './PurchaseHIstoryDetail'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import PurchaseHistoryRow from './PurchaseHistoryRow'
import ConfirmDialog from '../../../others/ConfirmDialog'


const PurchaseHistory = () => {
    const billList = useSelector((state) => state.purchaseHistory.billList)
    const dialog = useSelector(state => state.confirmDialog.confirmation)

    useEffect(() => {
    }, [billList])

    useEffect(() => {
    }, [dialog])

    return (
        <div className='purchase-history-container'>
            
            <div id="purchase-history-detail-wrapper">
                <PurchaseHistoryDetail/>
            </div>
            {
                dialog.show ? (
                    <div id="confirm-dialog-wrapper">
                        <ConfirmDialog/>
                    </div>
                ) : null
            }

            <div id='purchase-history-scroll'>
                <table className='purchase-history-table'>
                    
                    <thead>
                        <tr className='purchase-history-header'>
                            <th style={{
                                width: '4%'
                            }}> ID </th>
                            <th style={{
                                width: '25%'
                            }}> Nơi giao hàng </th>
                            <th style={{
                                width: '18%'
                            }}> Ngày đặt hàng </th>
                            <th style={{
                                width: '18%'
                            }}> Ngày xử lý </th>
                            <th style={{
                                width: '12%'
                            }}> Trạng thái đơn hàng </th>
                            <th style={{
                                width: '10%'
                            }}> Chi tiết đơn hàng </th>
                            <th style={{
                                width: '8%'
                            }}> Tổng cộng </th>
                            <th style={{
                                width: '5%'
                            }}> Hủy đặt hàng </th>
                        </tr>
                    </thead>

                    <tbody> 

                        {
                            billList.length !== 0 ? (
                                billList.map((item) => {
                                    if(!item._destroy){
                                        return (
                                            <PurchaseHistoryRow key={item.billID} data={item}/>
                                        )
                                    }
                                })
                            ) : <tr className='purchase-history-record'>
                                <td colSpan={8} style={{
                                    fontSize: "var(--header-font-size)",
                                    fontFamily: "var(--header-font)"
                                }}> Hiện chưa có đơn hàng nào </td>
                            </tr>
                        }
                        
                    </tbody>

                </table>
            </div>

            <ToastContainer/>
        </div>
    )
}

export default PurchaseHistory