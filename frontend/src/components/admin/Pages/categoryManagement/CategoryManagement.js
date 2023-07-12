import '../management.css'
import './categoryManagement.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import { showToastResult } from '../../../others/utilsAPI';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import CategoryForm from './CategoryForm';
import categorySlice from '../../../../reducers/componentsReducer/categoryMgmt/categoryMgmtSlice';
import getAllCategories from '../../../../reducers/apiReducer/categoryAPI/getAllCategories';
import { refreshTokenHandler } from '../../../../reducers/apiReducer/signFormAPI/refreshToken';
import { deleteCategory } from '../../../../reducers/apiReducer/categoryAPI/index';
import BarChart from '../../charts/BarChart'
import cateSlice from '../../../../reducers/componentsReducer/categoryMgmt/categoryMgmtSlice';
import { multipleColor } from '../../others/utils';

const CategoryManagement = () => {

    const isLoading = useSelector((state) => state.getCategories.isLoading);
    const categoryList = useSelector((state) => state.getCategories.categoriesList);
    const productList = useSelector((state) => state.getProducts.productsList);
    const signInData = useSelector((state) => state.signIn.data);
    const privileged = signInData.user.privileged;
    const detailList = useSelector((state) => state.getBills.billDetailList);
    const cateList = useSelector(state => state.cateMgmt.cateList)
    const labelList = useSelector(state => state.cateMgmt.labelList)
    const [chartData, setChartData] = useState({
        label: [],
        data: []
    })
    const [colorList, setColorList] = useState([])

    const dispatch = useDispatch();

    useEffect(() => {
        if (Object.keys(detailList).length !== 0) {
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
                            local[detailProduct[i]] = {
                                quantity: quantity + detailList[y][index].quantity,
                                total: total + (detailList[y][index].totalAmount - (detailList[y][index].totalAmount * detailList[y][index].discount))
                            }
                        }
                    }
                }
            }
            // push all quantity and total amount of the same categoryID based on productID
            let tempList = []
            let tempLabel = []
            for (let i in categoryList) {
                let quantity = 0
                let total = 0
                for (let y in local) {
                    for (let z in productList) {
                        if (productList[z].bookid === y && productList[z].category === categoryList[i].categoryID) {
                            quantity += local[y].quantity
                            total += local[y].total
                            tempList[categoryList[i].categoryID] = {
                                quantity,
                                total
                            }
                            if (!tempLabel.includes(categoryList[i].categoryID))
                                tempLabel.push(categoryList[i].categoryID)
                        }
                    }
                }
            }
            setChartData({
                label: tempLabel,
                data: tempList
            })
            let tempCate = {
                cateListQuantity: [],
                cateListTotal: []
            };
            let count = 0
            let newLabel = []
            for (let i in tempList) {
                if (count < 2) {
                    if (!newLabel.includes(i))
                        newLabel.push(i)
                    tempCate.cateListQuantity.push(tempList[i].quantity)
                    tempCate.cateListTotal.push(tempList[i].total)
                    count++
                }
                else break
            }
            setColorList(multipleColor(newLabel.length))
            dispatch(cateSlice.actions.setLabelList(newLabel))
            dispatch(cateSlice.actions.setCateList(tempCate))
            if (document.getElementById('list-one')) {
                document.getElementById('list-one').value = newLabel[0]
                document.getElementById('list-two').value = newLabel[1]
            }
        }
    }, []);

    const [form, setForm] = useState(false);

    const handleChangeForm = (props) => {
        if (props.action === 'update') {
            dispatch(categorySlice.actions.selectedCategory(props.data));
            setForm(!form);
        }
        else {
            if (privileged.includes('ADM-C') || privileged.includes('ADM-C-C')) {
                dispatch(categorySlice.actions.selectedCategory(props.data));
                setForm(!form);
            }
            else {
                showToastResult({ type: 'error', content: 'Bạn không có quyền thực hiện hành động này!!!' })
            }
        }
    }

    const handleRemoveItem = async (categoryID) => {
        if (privileged.includes('ADM-D')) {
            const newAccess = await refreshTokenHandler(signInData.accessToken, dispatch);
            let text = "Are you sure to delete this category\nEither OK or Cancel.";
            if (window.confirm(text) === true) {
                var flag = false;
                for (let i = 0; i < productList.length; ++i) {
                    if (productList[i].category === categoryID) {
                        flag = true;
                        break;
                    }
                }
                if (flag === true) { // con sach trong the loai
                    showToastResult({ type: 'warning', content: 'Còn sách trong thể loại!!!' })
    
                }
                else {
                    deleteCategory({ categoryID: categoryID, accessToken: newAccess })
                    dispatch(getAllCategories.actions.removeCategory(categoryID));
                    showToastResult({ type: 'success', content: 'Xóa thể loại thành công!!!' })
    
                }
            }
        }
        else {
            showToastResult({ type: 'error', content: 'Bạn không có quyền thực hiện hành động này!!!' })
        }
    }

    const handleList = (list, id) => {
        if (!chartData.label.includes(id)) {
            toast.warning(`Hiện thể loại ${id} chưa bán được sản phẩm nào :(`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                pauseOnFocusLoss: false,
                progress: undefined,
                theme: "dark",
            });
        }
        else {
            let tempCate = {
                cateListQuantity: [],
                cateListTotal: []
            };
            let newLabel = []
            for (let i in chartData.data) {
                if (i === id) {
                    newLabel.push(i)
                    tempCate.cateListQuantity.push(chartData.data[i].quantity)
                    tempCate.cateListTotal.push(chartData.data[i].total)
                    break
                }
            }
            for (let i in chartData.data) {
                if (i === (document.getElementById(`list-${list === 1 ? 'two' : 'one'}`).value)) {
                    newLabel.push(i)
                    tempCate.cateListQuantity.push(chartData.data[i].quantity)
                    tempCate.cateListTotal.push(chartData.data[i].total)
                    break
                }
            }
            setColorList(multipleColor(newLabel.length))
            dispatch(cateSlice.actions.setLabelList(newLabel))
            dispatch(cateSlice.actions.setCateList(tempCate))
            document.getElementById(`list-${list === 1 ? 'one' : 'two'}`).value = id
        }
    }

    return (
        <>
            {isLoading ? <div className='loader'></div>
                :
                <>
                    {form === false
                        ?
                        (
                            <div className='panel-container'>
                                <div className='panel-title'> Quản lý thể loại sách </div>
                                <div className='panel-content'>
                                    <div className='panel-btns'>
                                        <button className=' btn btn-green' onClick={() => handleChangeForm({ data: {}, action: 'create' })}> Thêm thể loại </button>
                                    </div>
                                    <div className='panel-table'>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th> Mã thể loại </th>
                                                    <th> Tên thể loại </th>
                                                    <th> Hành động </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    categoryList.map((item) => {
                                                        return (
                                                            <tr key={item.categoryID}>
                                                                <th>{item.categoryID}</th>
                                                                <th>{item.name}</th>
                                                                <th>
                                                                    <button className='btn btn-form-edit' onClick={() => handleChangeForm({ data: item, action: 'update' })}>
                                                                        <i className="fa-solid fa-gear"></i>
                                                                    </button>
                                                                    <button className='btn btn-form-trash' onClick={() => handleRemoveItem(item.categoryID)}>
                                                                        <i className="fa-solid fa-trash"></i>
                                                                    </button>
                                                                </th>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>

                                        <div className="panel-statistic" style={{
                                            margin: '10px 20px',
                                        }}>
                                            <span> Chọn ra 2 thể loại để thống kê: </span>
                                            <select style={{
                                                margin: "10px"
                                            }} id='list-one' onChange={(e) => handleList(1, e.target.value)}>
                                                {
                                                    categoryList.map((item) => {
                                                        return <option key={item.categoryID} value={item.categoryID}> {item.name} </option>
                                                    })
                                                }
                                            </select>
                                            <select style={{
                                                marginLeft: 10
                                            }} id='list-two' onChange={(e) => handleList(2, e.target.value)}>
                                                {
                                                    categoryList.map((item) => {
                                                        return <option key={item.categoryID} value={item.categoryID}> {item.name} </option>
                                                    })
                                                }
                                            </select>
                                            <div id='category-mgmt-chart-section'>
                                                <BarChart
                                                    title={"Doanh thu"}
                                                    label={labelList.length !== 0 ? labelList : []}
                                                    data={cateList.cateListTotal.length !== 0 ? cateList.cateListTotal : []}
                                                    about={""}
                                                    showLegend={false}
                                                    color={colorList}
                                                />
                                                <BarChart
                                                    title={"Tổng số sản phẩm đã bán được"}
                                                    label={labelList.length !== 0 ? labelList : []}
                                                    data={cateList.cateListQuantity.length !== 0 ? cateList.cateListQuantity : []}
                                                    about={""}
                                                    showLegend={false}
                                                    color={colorList}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                        :
                        <CategoryForm />}
                </>
            }
            <ToastContainer />
        </>
    )

}



export default CategoryManagement;