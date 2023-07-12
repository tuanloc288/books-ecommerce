import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import billSlice from '../../../../reducers/componentsReducer/bills/billSlice';
import { formatDate } from '../../../others/utilsAPI';

const BillFilterSection = () => {
    const billList = useSelector((state) => state.getBills.billsList);
    const billDesFalse = billList.filter(item => item._destroy !== true);
    const billDesTrue = billList.filter(item => item._destroy === true);
    const isCheckedDesBill = useSelector(state => state.bills.isCheckedDesBill);
    const [billID, setBillID] = useState('');
    const [status, setStatus] = useState('All');
    const [userName, setUserName] = useState('');
    const [fromOrderDate, setFromOrderDate] = useState('');
    const [toOrderDate, setToOrderDate] = useState('');
    const [fromHandleDate, setFromHandleDate] = useState('');
    const [toHandleDate, setToHandleDate] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        setBillID('');
        setStatus('');
        setUserName('');
        setFromOrderDate('');
        setToOrderDate('');
        setFromHandleDate('');
        setToHandleDate('');
    }, [isCheckedDesBill])

    const clearInput = () => {
        setBillID('');
        setStatus('');
        setUserName('');
        setFromOrderDate('');
        setToOrderDate('');
        setFromHandleDate('');
        setToHandleDate('');
        dispatch(billSlice.actions.clearFilterBills());
    }

    const handleSetBillID = (e) => {
        setBillID(e.target.value);
        dispatch(billSlice.actions.setFilterByBillID(e.target.value));
        dispatch(billSlice.actions.setFilterBills(isCheckedDesBill === true ? billDesTrue : billDesFalse));
    }

    const handleSetStatus = (e) => {
        setStatus(e.target.value);
        dispatch(billSlice.actions.setFilterByStatus(e.target.value));
        dispatch(billSlice.actions.setFilterBills(isCheckedDesBill === true ? billDesTrue : billDesFalse));
    }

    const handleSetUserName = (e) => {
        setUserName(e.target.value);
        dispatch(billSlice.actions.setFilterByUserName(e.target.value));
        dispatch(billSlice.actions.setFilterBills(isCheckedDesBill === true ? billDesTrue : billDesFalse));
    }

    const handleSetFromOrderDate = (e) => {
        setFromOrderDate(e.target.value);
        dispatch(billSlice.actions.setFilterByFromOrderDate(formatDate(e.target.value)));
        dispatch(billSlice.actions.setFilterBills(isCheckedDesBill === true ? billDesTrue : billDesFalse));
    }

    const handleSetToOrderDate = (e) => {
        setToOrderDate(e.target.value);
        dispatch(billSlice.actions.setFilterByToOrderDate(formatDate(e.target.value)));
        dispatch(billSlice.actions.setFilterBills(isCheckedDesBill === true ? billDesTrue : billDesFalse));
    }

    const handleSetFromHandleDate = (e) => {
        setFromHandleDate(e.target.value);
        dispatch(billSlice.actions.setFilterByFromHandleDate(formatDate(e.target.value)));
        dispatch(billSlice.actions.setFilterBills(isCheckedDesBill === true ? billDesTrue : billDesFalse));
    }

    const handleSetToHandleDate = (e) => {
        setToHandleDate(e.target.value);
        dispatch(billSlice.actions.setFilterByToHandleDate(formatDate(e.target.value)));
        dispatch(billSlice.actions.setFilterBills(isCheckedDesBill === true ? billDesTrue : billDesFalse));
    }

    return (
        <>
            <div className="management-filter-section">
                <div className="search-by-object">
                    <div className="sub-title"> Status: </div>
                    <select name="billSelection" className="category-selection" onChange={handleSetStatus} value={status} >
                        <option value="All"> Tất cả </option>
                        <option value="Đã xử lý"> Đã xử lý </option>
                        <option value="Chưa xử lý"> Chưa xử lý </option>
                    </select>
                </div>

                <div className="search-by-object">
                    <div className="sub-title"> Mã hóa đơn </div>
                    <input
                        className="search-input"
                        placeholder="Tìm mã hóa đơn..."
                        onChange={handleSetBillID}
                        value={billID}
                    />
                </div>

                <div className="search-by-object">
                    <div className="sub-title"> Tên tài khoản </div>
                    <input
                        className="search-input"
                        placeholder="Tìm tên tài khoản..."
                        onChange={handleSetUserName}
                        value={userName}
                    />
                </div>

                <div className="search-by-object">
                    <div className="sub-title"> Ngày đặt hàng </div>
                    <input
                        className="search-input"
                        onChange={handleSetFromOrderDate}
                        value={fromOrderDate}
                        type={"date"}
                    />
                    <div> to </div>
                    <input
                        className="search-input"
                        onChange={handleSetToOrderDate}
                        value={toOrderDate}
                        type={"date"}
                    />
                </div>

                <div className="search-by-object">
                    <div className="sub-title"> Ngày xử lý </div>
                    <input
                        className="search-input"
                        onChange={handleSetFromHandleDate}
                        value={fromHandleDate}
                        type={"date"}
                    />
                    <div> to </div>
                    <input
                        className="search-input"
                        onChange={handleSetToHandleDate}
                        value={toHandleDate}
                        type={"date"}
                    />
                </div>

            </div>
            <div className="search-btn-section">
                <button className="management-filter-btn" onClick={clearInput}> Xóa tất cả </button>
            </div>
        </>
    );
};

export default BillFilterSection;