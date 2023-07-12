import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BillManagement from './BillManagement';
import './billManagement.css';
import 'react-toastify/dist/ReactToastify.css';
import { fetchAllBillDetails } from '../../../../reducers/apiReducer/billDetailAPI/getAllBillDetails';
import { toMoney } from '../../../others/utilsAPI';
import { refreshTokenHandler } from '../../../../reducers/apiReducer/signFormAPI/refreshToken';

const BillForm = () => {

    const dispatch = useDispatch();
    const signInData = useSelector((state) => state.signIn.data);
    const selectedBill = useSelector((state) => state.bills.selected);
    const billDetailList = useSelector((state) => state.getBillDetails.billDetailsList);
    const productList = useSelector((state) => state.getProducts.productsList);

    const [change, setChange] = useState(false);
    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const newAccess = await refreshTokenHandler(signInData.accessToken, dispatch);
        dispatch(fetchAllBillDetails({ billID: selectedBill.billID, accessToken: newAccess }));
    }

    function findBookNameByID(id) {
        for (let i = 0; i < productList.length; ++i) {
            if (productList[i].bookid === id) {
                return productList[i].bookname;
            }
        }
    }

    const handleClose = () => {
        setChange(!change)
    }

    const handleSumTotalAmount = () => {
        var sum = 0;
        for (let i = 0; i < billDetailList.length; ++i) {
            sum += (billDetailList[i].price * billDetailList[i].quantity - (billDetailList[i].price * billDetailList[i].quantity * billDetailList[i].discount))
        }
        return sum;
    }

    return (
        <>
            {change === false ?
                <div className='panel-container'>
                    <div className='panel-form-form'>
                        <div className='panel-title'>Quản lý hoá đơn</div>
                        <div className='panel-form-title'> Chi tiết hóa đơn</div>
                        <form>
                            <div> Mã hóa đơn: {selectedBill.billID}</div>
                            <div> Trạng thái đơn hàng: {selectedBill.status}</div>
                            <div> Tổng cộng: {toMoney(selectedBill.totalAmount)}đ</div>
                            <div> Tài khoản thực hiện đặt hàng: {selectedBill.userName}</div>
                            <div> Tên: {selectedBill.name}</div>
                            <div> SĐT: {selectedBill.phone}</div>
                            <div> Địa chỉ: {selectedBill.address}</div>
                            <div className='row-item row-item-title'>
                                <div>Tên sách</div>
                                <div>Đơn giá</div>
                                <div>Số lượng</div>
                                <div>Khuyến mãi</div>
                                <div> Thành tiền </div>
                            </div>
                            {
                                billDetailList.length === 0 ? <></> :
                                    billDetailList.map(item => {
                                        return (
                                            <div className='row-item' key={item.billDetailID}>
                                                <div>{findBookNameByID(item.productID)}</div>
                                                <div>{toMoney(item.price)}đ</div>
                                                <div>x{item.quantity}</div>
                                                <div>{item.discount}</div>
                                                <div className='amount'>{toMoney(item.price * item.quantity - item.price * item.quantity * item.discount)}đ</div>
                                            </div>
                                        )
                                    })
                            }

                            <div className='separate-line'></div>
                            <div className='row-item'>
                                <div>Tổng hóa đơn </div>
                                <div>{toMoney(handleSumTotalAmount())}đ</div>
                            </div>
                            <div className='panel-form-btns'>
                                <button className='btn btn-red' onClick={handleClose}> Trở về </button>
                            </div>
                        </form>
                    </div>
                </div >
                : <BillManagement />}
        </>
    );
};

export default BillForm;