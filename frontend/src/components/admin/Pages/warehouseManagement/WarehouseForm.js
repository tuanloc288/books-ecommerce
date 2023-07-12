import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WarehouseManagement from './WarehouseManagement';
import { showToastResult } from '../../../others/utilsAPI';
import 'react-toastify/dist/ReactToastify.css';
import { refreshTokenHandler } from '../../../../reducers/apiReducer/signFormAPI/refreshToken';
import { toMoney } from '../../../others/utilsAPI';
import readXlsxFile from 'read-excel-file'
import { createWarehouse } from '../../../../reducers/apiReducer/warehouseAPI/index';
import { createWhDetail } from '../../../../reducers/apiReducer/warehouseDetailAPI/index';
import getAllWarehouses from '../../../../reducers/apiReducer/warehouseAPI/getAllWarehouses';
import { updateProduct } from '../../../../reducers/apiReducer/productAPI/index';
import getAllProducts from '../../../../reducers/apiReducer/productAPI/getAllProducts';
import { fetchAllWarehouseDetails } from '../../../../reducers/apiReducer/warehouseDetailAPI/getWarehouseDetail';
import { getCurrentDate } from '../../../others/utilsAPI';
import warehouseSlice from '../../../../reducers/componentsReducer/warehouses/warehouseSlice';

const WarehouseForm = () => {
    const dispatch = useDispatch();
    const signInData = useSelector((state) => state.signIn.data);
    const selectedWarehouse = useSelector((state) => state.warehouses.selected);
    const action = Object.keys(selectedWarehouse).length === 0 ? 'create' : 'view';
    const productList = useSelector((state) => state.getProducts.productsList);
    const warehouseList = useSelector((state) => state.getWarehouses.warehousesList);
    const whDetailList = useSelector((state) => state.getWhDetail.warehouseDetailsList);
    // const flag = useSelector(state => state.warehouses.action);
    const [change, setChange] = useState(false);
    const [dataRead, setDataRead] = useState([]);
    const whID = createWHID();

    const handleClose = () => {
        setChange(!change)
    }

    const handleReadFile = async (e) => {
        document.getElementById('separate-line').style.display = 'block';
        document.getElementById('totalAmout-create').style.display = "flex";
        var temp = readXlsxFile(e.target.files[0]);
        var array = [];
        var object = {};
        await temp.then(rows => {
            rows.map(row => {
                object = { ...row };
                array.push(object)
            }
            );
        })
        setDataRead(array);
    }

    //done
    const handleSubmit = async (e) => {
        e.preventDefault()
        const newAccess = await refreshTokenHandler(signInData.accessToken, dispatch);
        const isEmtpy = document.getElementById('input-file-excel').value
        if (isEmtpy === '')
            showToastResult({ type: 'warning', content: 'Chưa chọn file!!!' })

        else {
            var warehouse = {
                importNoteID: whID,
                totalItems: handleSumTotalItems(),
                totalAmount: handleSumTotalAmountCreate(),
                userName: signInData.user.userName,
            }
            await createWarehouse({ data: warehouse, accessToken: newAccess })
            dispatch(getAllWarehouses.actions.addWarehouse({
                importNoteID: whID,
                totalItems: handleSumTotalItems(),
                totalAmount: handleSumTotalAmountCreate(),
                userName: signInData.user.userName,
                createdAt: getCurrentDate(),
                _deytroy: false,
            }));
            // warehouse detail
            for (let i = 1; i < dataRead.length; ++i) {
                // dua len dtb
                var whDetail = {
                    importNoteDetailID: (whID + '-' + i),
                    importNoteID: whID,
                    productID: dataRead[i][0],
                    price: dataRead[i][2],
                    quantity: dataRead[i][3],
                    totalAmount: dataRead[i][4],
                }
                await createWhDetail({ data: whDetail, accessToken: newAccess })
                // update instock product
                var product = getProductByID(dataRead[i][0]);
                updateProduct({
                    bookid: product.bookid,
                    data: { inStock: (product.inStock + dataRead[i][3]) },
                    accessToken: newAccess
                })
                Object.assign(product, {
                    inStock: (product.inStock + dataRead[i][3])
                });
                dispatch(getAllProducts.actions.updateProduct(product));
            }
            showToastResult({ type: 'success', content: 'Nhập thành công!!!' })

            setTimeout(() => {
                setChange(!change);
            }, 2500)
        }

    }

    function getProductByID(id) {
        for (let i = 0; i < productList.length; ++i) {
            if (productList[i].bookid === id) {
                return { ...productList[i] }
            }
        }
    }

    const handleSumTotalAmountCreate = () => {
        var sum = 0;
        for (let i = 0; i < dataRead.length; ++i) {
            if (i !== 0)
                sum += dataRead[i][4];
        }
        return sum;
    }

    const handleSumTotalAmountView = () => {
        var sum = 0;
        for (let i = 0; i < whDetailList.length; ++i) {
            sum += whDetailList[i].totalAmount
        }
        return sum;
    }

    const handleSumTotalItems = () => {
        var sum = 0;
        for (let i = 0; i < dataRead.length; ++i) {
            if (i !== 0)
                sum += dataRead[i][3];
        }
        return sum;
    }

    function createWHID() {
        const str = 'whImportNote';
        var id = '';
        var count = '';
        var temp = null;
        var max = 0;
        if (warehouseList.length === 0) {
            id = str + 1;
        }
        else {
            warehouseList.map(item => {
                temp = item.importNoteID;
                for (let i = 0; i < temp.length; ++i) {
                    if (temp.charAt(i).match(/[0-9]/)) {
                        count += temp.charAt(i);
                    }
                }
                if (max < parseInt(count)) {
                    max = count;
                }
                count = '';
            })
            id = str + (parseInt(max) + 1);
        }
        return id;
    }

    return (
        <>
            {change === false ?
                action === 'create'
                    ?
                    <div className='panel-container'>
                        <div className='panel-form-form'>
                            <div className='panel-title'>Quản lý nhập kho</div>
                            <div className='panel-form-title'> Tạo phiếu nhập</div>
                            <form>
                                <div>whImportID: {whID}</div>
                                <input type={'file'} id='input-file-excel' onChange={handleReadFile}></input>
                                {dataRead.length !== 0 ?
                                    dataRead.map((item, index) => {
                                        if (index === 0) {
                                            return (
                                                <div className='row-item row-item-title' key={item[0]}>
                                                    <div>{item[1]}</div>
                                                    <div>{item[0]}</div>
                                                    <div>{item[2]}</div>
                                                    <div>{item[3]}</div>
                                                    <div>{item[4]}</div>
                                                </div>
                                            )
                                        }
                                        else {
                                            return (
                                                <div className='row-item' key={item[0]}>
                                                    <div>{item[1]}</div>
                                                    <div>{item[0]}</div>
                                                    <div>{toMoney(item[2])}đ</div>
                                                    <div>{item[3]}</div>
                                                    <div>{toMoney(item[4])}đ</div>
                                                </div>
                                            )
                                        }
                                    }
                                    )
                                    :
                                    <></>}
                                <div id='separate-line' className='separate-line' style={{ display: 'none' }}></div>
                                <div id='totalAmout-create' className='row-item' style={{ display: 'none' }}>
                                    <div style={{ fontWeight: 'bold' }}>Tổng hóa đơn </div>
                                    <div>{toMoney(handleSumTotalAmountCreate())}đ</div>
                                </div>
                                <div className='panel-form-btns'>
                                    <button type="submit" className='btn btn-green' onClick={handleSubmit}> Xác nhận </button>
                                    <button className='btn btn-red' onClick={handleClose}> Trở về </button>
                                </div>
                            </form>
                        </div>
                    </div >
                    : <div className='panel-container'>
                        <div className='panel-form-form'>
                            <div className='panel-title'>Quản lý nhập kho</div>
                            <div className='panel-form-title'> Tạo phiếu nhập</div>
                            <form>
                                <div><span style={{ fontWeight: 'bold' }}>whImportID:</span> {selectedWarehouse.importNoteID}</div>
                                <div><span style={{ fontWeight: 'bold' }}>Tổng sản phẩm::</span> {selectedWarehouse.totalItems}</div>
                                <div><span style={{ fontWeight: 'bold' }}>Tổng tiền:</span> {toMoney(selectedWarehouse.totalAmount)}</div>
                                <div><span style={{ fontWeight: 'bold' }}>Tài khoản:</span> {selectedWarehouse.userName}</div>
                                <div><span style={{ fontWeight: 'bold' }}>Ngày tạo::</span> {selectedWarehouse.createdAt}</div>
                                <div className='row-item row-item-title'>
                                    <div>Tên sách</div>
                                    <div>Mã sách</div>
                                    <div>Giá</div>
                                    <div>Số lượng</div>
                                    <div>Thành tiền</div>
                                </div>
                                {
                                    // whDetailList?.length === 0 ? <></> :
                                    whDetailList.map((item) => {
                                        return (
                                            <div className='row-item' key={item.productID}>
                                                <div>{getProductByID(item.productID).bookname}</div>
                                                <div>{item.productID}</div>
                                                <div>{toMoney(item.price)}đ</div>
                                                <div>{item.quantity}</div>
                                                <div>{toMoney(item.totalAmount)}đ</div>
                                            </div>
                                        )
                                    })}
                                <div className='separate-line'></div>
                                <div className='row-item'>
                                    <div style={{ fontWeight: 'bold' }}>Tổng hóa đơn</div>
                                    <div>{toMoney(handleSumTotalAmountView())}đ</div>
                                </div>
                                <div className='panel-form-btns'>
                                    <button className='btn btn-red' onClick={handleClose}> Trở về </button>
                                </div>
                            </form>
                        </div>
                    </div >
                : <WarehouseManagement />}
        </>
    );
};

export default WarehouseForm;