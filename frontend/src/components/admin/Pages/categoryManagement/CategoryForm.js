import { useState } from 'react';
import { useSelector } from 'react-redux';
import CategoryManagement from './CategoryManagement';
import { refreshTokenHandler } from '../../../../reducers/apiReducer/signFormAPI/refreshToken';
import { useDispatch } from 'react-redux';
import getAllCategories from '../../../../reducers/apiReducer/categoryAPI/getAllCategories';
import { createCategory, updateCategory } from '../../../../reducers/apiReducer/categoryAPI/index';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import { showToastResult } from '../../../others/utilsAPI';

const CategoryForm = () => {

    const selectedCategory = useSelector((state) => state.cateMgmt.selected);
    const signInData = useSelector((state) => state.signIn.data);
    const cateList = useSelector(state => state.getCategories.categoriesList);
    const privileged = signInData.user.privileged;

    const [change, setChange] = useState(false);
    const [cateID, setCateID] = useState('');
    const [cateName, setCateName] = useState('');

    const action = Object.keys(selectedCategory).length === 0 ? 'create' : 'update';
    const dispatch = useDispatch();

    const handleCancel = () => {
        let text = "Changes you made may not be saved\nEither OK or Cancel.";
        if (window.confirm(text) === true) {
            setChange(!change);
        }
    }

    const validateCategory = (cate) => {
        if (action === 'update') {
            if (cate.categoryID.trim() === '' || cate.name.trim() === '') {
                return 'chưa nhập';
            }
            for (let i = 0; i < cateList.length; ++i) {
                if (cate.name.trim() === cateList[i].name)
                    return 'trùng tên';
            }
            return 'ok'
        }
        else {
            if (cate.categoryID.trim() === '' || cate.name.trim() === '') {
                return 'chưa nhập';
            }
            else {
                for (let i = 0; i < cateList.length; ++i) {
                    if (cate.categoryID.trim() === cateList[i].categoryID && cate.name.trim() === cateList[i].name)
                        return 'tồn tại';
                    if (cate.name.trim() === cateList[i].name)
                        return 'trùng tên';
                }
            }
            return 'ok'
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newAccess = await refreshTokenHandler(signInData.accessToken, dispatch);
        if (action === 'create') {
            var category = {
                categoryID: cateID,
                name: cateName,
            }
            const res = validateCategory(category);
            if (res === 'ok') {
                createCategory({ data: category, accessToken: newAccess });
                dispatch(getAllCategories.actions.addCategory(category));
                showToastResult({ type: 'success', content: 'Tạo thể loại thành công!!!' });
                setTimeout(() => {
                    setChange(!change)
                }, 2000);
            }
            else if (res === 'tồn tại') {
                showToastResult({ type: 'error', content: 'Đã có thể loại này!!!' })
            }
            else if (res === 'trùng tên')
                showToastResult({ type: 'warning', content: 'Trùng tên thể loại!!!' })
            else {
                showToastResult({ type: 'warning', content: 'Cần nhập các trường quy định!!!' })
            }
        }
        else {
            if (privileged.includes('ADM-C-U') || privileged.includes('ADM-U')) {
                var category = { ...selectedCategory };
                Object.assign(category, {
                    name: cateName
                });
                const res = validateCategory(category);
                if (res === 'ok') {
                    updateCategory({
                        categoryID: category.categoryID,
                        data: { name: cateName }, accessToken: newAccess
                    });
                    dispatch(getAllCategories.actions.updateCategory(category))

                    showToastResult({ type: 'success', content: 'Sửa thể loại thành công!!!' })

                    setTimeout(() => {
                        setChange(!change)
                    }, 2000);
                }
                else if (res === 'chưa nhập') {
                    showToastResult({ type: 'warning', content: 'Cần nhập các trường quy định!!!' })
                }
                else {
                    showToastResult({ type: 'warning', content: 'Trùng tên thể loại!!!' })

                }
            }
            else {
                showToastResult({ type: 'error', content: 'Bạn không có quyền thực hiện hành động này!!!' })
            }
        }
    }

    return (
        <>
            {change === false ?
                <div className='panel-container'>
                    <div className='panel-form-form'>
                        <div className='panel-title'> Quản lý thể loại </div>
                        <div className='panel-form-title'> {action === 'create' ? 'Thêm' : 'Chỉnh sửa'} thể loại </div>
                        <form >
                            {action === 'create' ?
                                <>
                                    <div> Mã thể loại <span id='required'>***</span></div>
                                    <input onChange={(e) => { setCateID(e.target.value) }} required />
                                    <div> Tên thể loại <span id='required'>***</span></div>
                                    <input onChange={(e) => { setCateName(e.target.value) }} required />
                                </>
                                :
                                <>
                                    <div> Mã thể loại </div>
                                    <input disabled defaultValue={selectedCategory.categoryID} onChange={(e) => { setCateID(e.target.value) }} required />
                                    <div> Tên thể loại </div>
                                    <input defaultValue={selectedCategory.name} onChange={(e) => { setCateName(e.target.value) }} required />
                                </>
                            }
                            <div className='panel-form-btns'>
                                <button type='submit' className='btn btn-green' onClick={handleSubmit}>Xác nhận</button>
                                <button className='btn btn-red' onClick={handleCancel}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
                : <CategoryManagement />}
        </>
    );
};

export default CategoryForm;