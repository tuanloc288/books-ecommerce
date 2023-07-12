import '../management.css'
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import productSlice from '../../../../reducers/componentsReducer/products/productSlice';
import ProductForm from './ProductForm';
import getAllProducts from '../../../../reducers/apiReducer/productAPI/getAllProducts';
import { refreshTokenHandler } from '../../../../reducers/apiReducer/signFormAPI/refreshToken';
import { toMoney } from '../../../others/utilsAPI';
import { deleteProduct, updateProduct } from '../../../../reducers/apiReducer/productAPI/index';
import { showToastResult } from '../../../others/utilsAPI';
import BarChart from '../../charts/BarChart';

const ProductManagement = () => {

    const isLoading = useSelector((state) => state.getProducts.isLoading);
    const productList = useSelector((state) => state.getProducts.productsList);
    const productRemove = useSelector((state) => state.products.productsCheckedRemove);
    const filterProducts = useSelector((state) => state.products.filterProducts);
    const signInData = useSelector((state) => state.signIn.data);
    const privileged = signInData.user.privileged;
    const dispatch = useDispatch();
    const isFilter = useSelector((state) => state.products.isFilter);
    const detailList = useSelector((state) => state.getBills.billDetailList);
    var productDesFalse = productList.filter(item => item._destroy !== true);
    const isCheckedDesProduct = useSelector((state) => state.products.isCheckedDesProduct);

    const [chartData, setChartData] = useState([])

    // start pagination
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    var itemsPerPage = 10;
    var endOffset = null;

    useEffect(() => {
        return () => {
          dispatch(productSlice.actions.clearFilterProducts())
        }
      },[])

    useEffect(() => {
        var endOffset = itemOffset + itemsPerPage;
        setCurrentItems(checkMainArray().slice(itemOffset, endOffset));
        setPageCount(Math.ceil(checkMainArray().length / itemsPerPage));
    }, [itemOffset, itemsPerPage, productList, filterProducts, productRemove]);


    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % checkMainArray().length;
        setCurrentPage(event.selected);
        setItemOffset(newOffset);
    };

    const [form, setForm] = useState(false);

    const handleChangeForm = (props) => {
        if (props.action === 'update') {
            dispatch(productSlice.actions.selectedProduct(props.data))
            setForm(!form);
        }
        else {
            if (privileged.includes('ADM-C') || privileged.includes('ADM-P-C')) {
                dispatch(productSlice.actions.selectedProduct(props.data))
                setForm(!form);
            }
            else {
                showToastResult({ type: 'error', content: 'Bạn không có quyền thực hiện hành động này!!!' })
            }
        }
    }

    const handleSelectedProduct = (productTemp) => {
        if (productRemove.length === 0) {
            dispatch(productSlice.actions.setProductsCheckedRemove(productTemp));
        }
        else {
            var flag = false;
            productRemove.map((product) => {
                if (productTemp === product) {
                    flag = true;
                    dispatch(productSlice.actions.removeElementProductsChecked(productTemp.bookid));
                }
            })
            if (flag === false) {
                dispatch(productSlice.actions.setProductsCheckedRemove(productTemp));
            }
        }
    }

    function checkMainArray() {
        if (filterProducts.length === 0) {
            return productDesFalse;
        }
        else {
            return filterProducts;
        }
    }

    const handleSetIsAvailable = async (e) => {
        if (privileged.includes('ADM-U') || privileged.includes('ADM-P-U')) {
            if (isCheckedDesProduct === false) {
                const parentClassName = e.target.parentElement.className;
                const parentEle = e.target.parentElement;
                const childEle = e.target;
                if (parentClassName === "btn-change-status-true") {
                    childEle.style.animationName = 'rightToLeft';
                    childEle.style.animationDuration = '0.5s';
                    childEle.style.animationFillMode = 'forwards';
                    parentEle.style.backgroundColor = 'rgb(243, 238, 238)';

                    parentEle.classList.remove("btn-change-status-true")
                    parentEle.classList.add("btn-change-status-false")
                    childEle.classList.remove("btn-change-status-true-circle")
                    childEle.classList.add("btn-change-status-false-circle")

                }
                else {
                    childEle.style.animationName = 'leftToRight';
                    childEle.style.animationDuration = '0.5s';
                    childEle.style.animationFillMode = 'forwards';
                    parentEle.style.backgroundColor = 'var(--letter-color)';

                    parentEle.classList.remove("btn-change-status-false")
                    parentEle.classList.add("btn-change-status-true")
                    childEle.classList.remove("btn-change-status-false-circle")
                    childEle.classList.add("btn-change-status-true-circle")
                }

                const bookid = e.target.attributes.value.value
                var product = productList.filter((product) => {
                    if (product.bookid === bookid) {
                        return product;
                    }
                })
                product = { ...product[0] };
                const available = !product.isAvailable
                Object.assign(product, { isAvailable: available });
                const newAccess = await refreshTokenHandler(signInData.accessToken, dispatch);
                dispatch(getAllProducts.actions.updateProduct(product));
                updateProduct({ bookid: product.bookid, data: { isAvailable: available }, accessToken: newAccess });
                showToastResult({ type: 'success', content: 'Sửa sản phẩm thành công!!!' });
            }
            else {
                showToastResult({ type: 'error', content: 'Không thể thực hiện hành động này khi đã xóa!!!' });
            }
        }
        else {
            showToastResult({ type: 'error', content: 'Bạn không có quyền thực hiện hành động này!!!' })
        }
    }

    const handleRemoveProduct = async (productTemp) => {
        if (privileged.includes('ADM-U') || privileged.includes('ADM-P-U')) {
            const newAccess = await refreshTokenHandler(signInData.accessToken, dispatch);
            if (productTemp._destroy === false) {
                let text = "Are you sure to move this book to trash\nEither OK or Cancel.";
                if (window.confirm(text) === true) {
                    //for ui
                    if (checkMainArray() === filterProducts) {
                        dispatch(productSlice.actions.removeElementFilterProducts(productTemp.bookid));
                    }
                    else {
                        productDesFalse = productDesFalse.filter(item => item.bookid !== productTemp.bookid);
                    }
                    //for database
                    productTemp = { ...productTemp };
                    const destroy = !productTemp._destroy
                    const isAvailable = !productTemp.isAvailable;
                    Object.assign(productTemp, { _destroy: destroy });
                    Object.assign(productTemp, { isAvailable: isAvailable });
                    dispatch(getAllProducts.actions.updateProduct(productTemp));
                    updateProduct({ bookid: productTemp.bookid, data: { _destroy: destroy, isAvailable: isAvailable }, accessToken: newAccess });
                    showToastResult({ type: 'success', content: 'Xóa tạm sách thành công!!!' });
                }
            }
            else {
                if (privileged.includes('ADM-D') || privileged.includes('ADM-P-D')) {
                    let text = "Are you sure to delete this book from database\nEither OK or Cancel.";
                    if (window.confirm(text) === true) {
                        if (checkMainArray() === filterProducts) {
                            dispatch(productSlice.actions.removeElementFilterProducts(productTemp.bookid));
                        }
                        dispatch(getAllProducts.actions.removeProduct(productTemp.bookid));
                        deleteProduct({ bookid: productTemp.bookid, accessToken: newAccess })
                        showToastResult({ type: 'success', content: 'Xóa vĩnh viễn sách thành công!!!' });
                    }
                }
                else {
                    showToastResult({ type: 'error', content: 'Bạn không có quyền thực hiện hành động này!!!' })
                }
            }
        }
        else {
            showToastResult({ type: 'error', content: 'Bạn không có quyền thực hiện hành động này!!!' })
        }
    }

    


    // chua database
    const handleDeleteAllChecked = async () => {
        if (privileged.includes('ADM-D')) {
            const newAccess = await refreshTokenHandler(signInData.accessToken, dispatch);
            if (productRemove[0]._destroy === false) {
                let text = "Are you sure to move all this books to trash\nEither OK or Cancel.";
                if (window.confirm(text) === true) {
                    for (let i = 0; i < productRemove.length; ++i) {
                        if (checkMainArray() === filterProducts) {
                            dispatch(productSlice.actions.removeElementFilterProducts(productRemove[i].bookid));
                        }
                        var productTemp = { ...productRemove[i] };
                        const destroy = !productTemp._destroy
                        const isAvailable = !productTemp
                        Object.assign(productTemp, { _destroy: destroy });
                        Object.assign(productTemp, { isAvailable: isAvailable });
                        dispatch(getAllProducts.actions.updateProduct(productTemp));
                        updateProduct({ bookid: productTemp.bookid, data: { _destroy: destroy, isAvailable: isAvailable }, accessToken: newAccess });
                        dispatch(productSlice.actions.clearProductsCheckedRemove());
                    }
                    showToastResult({ type: 'success', content: 'Xóa tạm sách thành công!!!' });
                }
            }
            else {
                let text = "Are you sure to delete all this books from database\nEither OK or Cancel.";
                if (window.confirm(text) === true) {
                    for (let i = 0; i < productRemove.length; ++i) {
                        if (checkMainArray() === filterProducts) {
                            dispatch(productSlice.actions.removeElementFilterProducts(productRemove[i].bookid));
                        }
                        dispatch(getAllProducts.actions.removeProduct(productRemove[i].bookid));
                        deleteProduct({ bookid: productRemove[i].bookid, accessToken: newAccess })
                        dispatch(productSlice.actions.clearProductsCheckedRemove());
                    }
                    showToastResult({ type: 'success', content: 'Xóa vĩnh viễn sách thành công!!!' });
                }
            }
        }
        else {
            showToastResult({ type: 'error', content: 'Bạn không có quyền thực hiện hành động này!!!' })
        }
    }

    const handleReverseProduct = async (productTemp) => {
        if (privileged.includes('ADM-U')) {
            const newAccess = await refreshTokenHandler(signInData.accessToken, dispatch);
            let text = "Do you want to reverse this book from trash\nEither OK or Cancel.";
            if (window.confirm(text) === true) {
                //for ui
                if (checkMainArray() === filterProducts) {
                    dispatch(productSlice.actions.removeElementFilterProducts(productTemp.bookid));
                }
                //for database
                productTemp = { ...productTemp };
                const destroy = !productTemp._destroy
                Object.assign(productTemp, { _destroy: destroy });
                dispatch(getAllProducts.actions.updateProduct(productTemp));
                updateProduct({ bookid: productTemp.bookid, data: { _destroy: destroy }, accessToken: newAccess });
                showToastResult({ type: 'success', content: 'Lấy lại sách thành công!!!' });
            }
        }
        else {
            showToastResult({ type: 'error', content: 'Bạn không có quyền thực hiện hành động này!!!' })
        }
    }

    const handleShowProductDes = () => {
        const checked = document.getElementById("checkedProductDes").checked;
        if (checked === true) {
            dispatch(productSlice.actions.setFilterByProductDestroy(productList));
        }
        else {
            dispatch(productSlice.actions.clearFilterProducts());
            dispatch(productSlice.actions.setFilterProducts(productDesFalse));
        }
        dispatch(productSlice.actions.clearProductsCheckedRemove());
    }

    useEffect(() => {
        if (Object.keys(detailList).length !== 0 && Object.keys(chartData).length === 0) {
            let local = []
            let detailProduct = []
            // get all productID in bill detail
            for (let i in detailList) {
                for (let index in detailList[i]) {
                    if (!detailProduct.includes(detailList[i][index].productID)) {
                        detailProduct.push(detailList[i][index].productID)
                    }
                }
            }
            // set quantity and total per productID
            for (let i in detailProduct) {
                let quantity = 0
                let total = 0
                for (let y in detailList) {
                    for (let index in detailList[y]) {
                        if (detailProduct[i] === detailList[y][index].productID) {
                            quantity += detailList[y][index].quantity
                            total += (detailList[y][index].totalAmount - (detailList[y][index].totalAmount * detailList[y][index].discount))
                        }
                    }
                }
                let tempQuantity = []
                tempQuantity.push(quantity)
                let tempTotal = []
                tempTotal.push(total)
                local[detailProduct[i]] = {
                    quantity: tempQuantity,
                    total: tempTotal
                }
            }
            setChartData(local)
        }
    }, [Object.keys(chartData)])

    



    return (
        <>
            {isLoading ? <div className='loader'></div>
                :
                <>
                    {form === false
                        ?
                        (
                            <div className='panel-container'>
                                <div className='panel-title'> Quản lý sách </div>
                                <div className='panel-content'>
                                    <div className='panel-btns'>
                                        <div className='panel-btns-action'>
                                            <button className='btn btn-green' onClick={() => handleChangeForm({ data: {}, action: 'create' })}> Thêm sách </button>
                                            <button className='btn btn-red' onClick={handleDeleteAllChecked}> Xóa sách</button>
                                        </div>
                                        <div className='panel-btns-checkbox' style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'flex-end'
                                        }}>
                                            <label> Các sản phẩm bị tạm xóa </label>
                                            {isCheckedDesProduct === true ?
                                                <input type={'checkbox'} checked onClick={handleShowProductDes} id='checkedProductDes'></input>
                                                : <input type={'checkbox'} onClick={handleShowProductDes} id='checkedProductDes'></input>
                                            }
                                        </div>
                                    </div>
                                    <div className='panel-table'>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th> </th>
                                                    <th> No </th>
                                                    <th> Mã sách </th>
                                                    <th> Ảnh </th>
                                                    <th style={{
                                                        width: 400
                                                    }}> Tên sách </th>
                                                    <th> Thể loại </th>
                                                    <th> Giá </th>
                                                    <th> Tác giả </th>
                                                    <th> Trạng thái </th>
                                                    <th> Hành động </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    currentItems === null ? setCurrentItems((filterProducts.length === 0 ? productDesFalse.slice(itemOffset, endOffset) : filterProducts.slice(itemOffset, endOffset)))
                                                        :
                                                        filterProducts.length === 0 && isFilter === true
                                                            ?
                                                            <tr>
                                                                <th colSpan={10}>
                                                                    <div className='no-data'>(Không tìm thấy theo bộ lọc)</div>
                                                                </th>
                                                            </tr>
                                                            :
                                                            currentItems.map((item, index) => {
                                                                return (
                                                                    <tr key={item.bookid} className='product-mgmt-row'>
                                                                        <th><input type={'checkbox'} value={item.bookid} onClick={() => handleSelectedProduct(item)} /></th>
                                                                        <th>{(index + 1) + (currentPage * itemsPerPage)}</th>
                                                                        <th>{item.bookid}</th>
                                                                        <th> <img src={item.image} alt={item.bookname} className='product-mgmt-img' /></th>
                                                                        <th>{item.bookname}</th>
                                                                        <th>{item.category}</th>
                                                                        <th>{toMoney(item.price)}đ</th>
                                                                        <th>{item.author}</th>
                                                                        <th>
                                                                            {item.isAvailable === true ?
                                                                                <div className='btn-change-status-true'>
                                                                                    <div className='btn-change-status-true-circle' onClick={handleSetIsAvailable} value={item.bookid}></div>
                                                                                </div>
                                                                                : <div className='btn-change-status-false'>
                                                                                    <div className='btn-change-status-false-circle' onClick={handleSetIsAvailable} value={item.bookid}></div>
                                                                                </div>
                                                                            }
                                                                        </th>
                                                                        <th>
                                                                            <button className='btn btn-form-edit' onClick={() => handleChangeForm({ data: item, action: 'update' })}>
                                                                                <i className="fa-solid fa-gear"></i>
                                                                            </button>
                                                                            {isCheckedDesProduct === true ?
                                                                                <button className='btn btn-form-reverse' onClick={() => handleReverseProduct(item)}>
                                                                                    <i className="fa-sharp fa-solid fa-rotate-left"></i>
                                                                                </button>
                                                                                : <></>
                                                                            }
                                                                            <button className='btn btn-form-trash' onClick={() => handleRemoveProduct(item)}>
                                                                                <i className="fa-solid fa-trash"></i>
                                                                            </button>
                                                                        </th>
                                                                        <th className='product-mgmt-statistic'>
                                                                            {
                                                                                Object.keys(chartData).length !== 0 && Object.keys(chartData).includes(item.bookid) ? (
                                                                                    <>
                                                                                        <BarChart
                                                                                            title={`Doanh thu của ${item.bookid}`}
                                                                                            label={['Doanh thu']}
                                                                                            data={chartData[item.bookid].total}
                                                                                            about={""}
                                                                                            showLegend={false}
                                                                                            height={145}
                                                                                            width={200}
                                                                                        />
                                                                                        <BarChart
                                                                                            title={`Tổng số ${item.bookid} đã bán được`}
                                                                                            label={['Số lượng']}
                                                                                            data={chartData[item.bookid].quantity}
                                                                                            about={""}
                                                                                            showLegend={false}
                                                                                            height={145}
                                                                                            width={200}
                                                                                        />
                                                                                    </>
                                                                                ) : <div style={{
                                                                                    width: "100%",
                                                                                    height: "100%",
                                                                                    display: "flex",
                                                                                    justifyContent: 'center',
                                                                                    alignItems: 'center',
                                                                                    fontWeight: "lighter"
                                                                                }}> Chưa bán được quyển nào </div>
                                                                            }
                                                                        </th>
                                                                    </tr>
                                                                )
                                                            })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    {filterProducts.length === 0 && isFilter === true ? <></> :
                                        <ReactPaginate
                                            breakLabel="..."
                                            nextLabel=">"
                                            onPageChange={handlePageClick}
                                            pageRangeDisplayed={5}
                                            pageCount={pageCount}
                                            previousLabel="<"
                                            renderOnZeroPageCount={null}
                                            containerClassName="react-pagination"
                                            pageLinkClassName='react-page-num'
                                            previousLinkClassName='react-page-num'
                                            nextLinkClassName='react-page-num'
                                            activeLinkClassName='react-page-active' />}
                                </div>
                            </div>
                        )
                        :
                        <ProductForm />}
                </>
            }
        </>
    )
}



export default ProductManagement;