import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import warehouseSlice from '../../../../reducers/componentsReducer/warehouses/warehouseSlice';
import { formatDate } from '../../../others/utilsAPI';

const WarehouseFilterSection = () => {
    const warehouseList = useSelector((state) => state.getWarehouses.warehousesList);
    const warehouseDesFalse = warehouseList.filter(item => item._destroy !== true);
    const warehouseDesTrue = warehouseList.filter(item => item._destroy === true);
    const isCheckedDesWarehouse = useSelector(state => state.warehouses.isCheckedDesWarehouse);
    const [warehouseID, setWarehouseID] = useState('');
    const [fromCreateDate, setFromCreateDate] = useState('');
    const [toCreateDate, setToCreateDate] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        setWarehouseID('');
        setFromCreateDate('');
        setToCreateDate('');
    }, [isCheckedDesWarehouse])

    const clearInput = () => {
        setWarehouseID('');
        setFromCreateDate('');
        setToCreateDate('');
        dispatch(warehouseSlice.actions.clearFilterWarehouses());
    }

    const handleSetWarehouseID = (e) => {
        setWarehouseID(e.target.value);
        dispatch(warehouseSlice.actions.setFilterByID(e.target.value.toLowerCase()));
        dispatch(warehouseSlice.actions.setFilterWarehouses(isCheckedDesWarehouse === true ? warehouseDesTrue : warehouseDesFalse));
    }

    const handleSetFromCreateDate = (e) => {
        setFromCreateDate(e.target.value);
        dispatch(warehouseSlice.actions.setFilterByFromCreateDate(formatDate(e.target.value)));
        dispatch(warehouseSlice.actions.setFilterWarehouses(isCheckedDesWarehouse === true ? warehouseDesTrue : warehouseDesFalse));
    }

    const handleSetToCreateDate = (e) => {
        setToCreateDate(e.target.value);
        dispatch(warehouseSlice.actions.setFilterByToCreateDate(formatDate(e.target.value)));
        dispatch(warehouseSlice.actions.setFilterWarehouses(isCheckedDesWarehouse === true ? warehouseDesTrue : warehouseDesFalse));
    }

    return (
        <>
            <div className="management-filter-section">
                <div className="search-by-object">
                    <div className="sub-title"> Mã nhập kho </div>
                    <input
                        className="search-input"
                        placeholder="Tìm mã hóa đơn..."
                        onChange={handleSetWarehouseID}
                        value={warehouseID}
                    />
                </div>
                <div className="search-by-object">
                    <div className="sub-title"> Ngày tạo </div>
                    <input
                        className="search-input"
                        onChange={handleSetFromCreateDate}
                        value={fromCreateDate}
                        type={"date"}
                    />
                    <div> to </div>
                    <input
                        className="search-input"
                        onChange={handleSetToCreateDate}
                        value={toCreateDate}
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

export default WarehouseFilterSection;