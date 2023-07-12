import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import productSlice from '../../../../reducers/componentsReducer/products/productSlice';

const BooksFilterSection = () => {
    const categoryList = useSelector((state) => state.getCategories.categoriesList);
    const productList = useSelector((state) => state.getProducts.productsList);
    const productDesFalse = productList.filter(item => item._destroy !== true);
    const isCheckedDesProduct = useSelector((state) => state.products.isCheckedDesProduct);
    const productDesTrue = productList.filter(item => item._destroy === true);
    const [bookName, setBookName] = useState('');
    const [author, setAuthor] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [filterCate, setFilterCate] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const dispatch = useDispatch();

    useEffect(() => {
        setAuthor('');
        setBookName('');
        setFilterCate('All');
        setMaxPrice('');
        setMinPrice('');
        setFilterStatus('All')
    }, [isCheckedDesProduct])


    const clearInput = () => {
        setAuthor('');
        setBookName('');
        setFilterCate('All');
        setMaxPrice('');
        setFilterStatus('All')
        setMinPrice('');
        dispatch(productSlice.actions.clearFilterProducts());
    }

    const handleSetBookName = (e) => {
        setBookName(e.target.value);
        dispatch(productSlice.actions.setFilterByBookName(e.target.value.toLowerCase()));
        dispatch(productSlice.actions.setFilterProducts(isCheckedDesProduct === true ? productDesTrue : productDesFalse));
    }


    const handleSetAuthor = (e) => {
        setAuthor(e.target.value);
        dispatch(productSlice.actions.setFilterByAuthor(e.target.value.toLowerCase()));
        dispatch(productSlice.actions.setFilterProducts(isCheckedDesProduct === true ? productDesTrue : productDesFalse));
    }

    const handleSetMinPrice = (e) => {
        setMinPrice(e.target.value);
        dispatch(productSlice.actions.setFilterByMinPrice(e.target.value));
        dispatch(productSlice.actions.setFilterProducts(isCheckedDesProduct === true ? productDesTrue : productDesFalse));
    }

    const handleSetMaxPrice = (e) => {
        setMaxPrice(e.target.value);
        dispatch(productSlice.actions.setFilterByMaxPrice(e.target.value));
        dispatch(productSlice.actions.setFilterProducts(isCheckedDesProduct === true ? productDesTrue : productDesFalse));
    }

    const handleSetFilterByCate = (e) => {
        setFilterCate(e.target.value);
        dispatch(productSlice.actions.setFilterByCate(e.target.value));
        dispatch(productSlice.actions.setFilterProducts(isCheckedDesProduct === true ? productDesTrue : productDesFalse));
    }

    const handleSetFilterByStatus = (e) => {
        setFilterStatus(e.target.value);
        dispatch(productSlice.actions.setFilterByStatus(e.target.value));
        dispatch(productSlice.actions.setFilterProducts(isCheckedDesProduct === true ? productDesTrue : productDesFalse));
    }

    return (
        <>
            <div className="management-filter-section">
                <div className="search-by-object">
                    <div className="sub-title"> Trạng thái: </div>
                    <select className="category-selection" onChange={handleSetFilterByStatus} value={filterStatus} >
                        <option value="All"> Tất cả </option>
                        <option value={true}> Được bán </option>
                        <option value={false}> Không được bán </option>
                    </select>
                </div>
                <div className="search-by-object">
                    <div className="sub-title"> Thể loại sách: </div>
                    <select className="category-selection" onChange={handleSetFilterByCate} value={filterCate} >
                        <option value="All"> Tất cả </option>
                        {categoryList.map((category) => {
                            return (
                                <option value={category.categoryID} key={category.categoryID}> {category.categoryID} </option>
                            )
                        })}
                    </select>
                </div>
                <div className="search-by-object">
                    <div className="sub-title"> Tên sách:</div>
                    <input
                        className="search-input"
                        name="bookName"
                        placeholder="Tìm tên sách..."
                        onChange={handleSetBookName}
                        value={bookName}
                    />
                </div>

                <div className="search-by-object">
                    <div className="sub-title"> Tên tác giả:</div>
                    <input
                        className="search-input"
                        name="authorName"
                        placeholder="Tìm tên tác giả..."
                        onChange={handleSetAuthor}
                        value={author}
                    />
                </div>

                <div className="search-by-object">
                    <div className="sub-title"> Giá thấp nhất:</div>
                    <input
                        className="search-input"
                        name="minPrice"
                        placeholder="Tìm giá thấp nhất..."
                        onChange={handleSetMinPrice}
                        value={minPrice}
                    />
                </div>

                <div className="search-by-object">
                    <div className="sub-title"> Giá cao nhất:</div>
                    <input
                        className="search-input"
                        name="maxPrice"
                        placeholder="Tìm giá cao nhất..."
                        onChange={handleSetMaxPrice}
                        value={maxPrice}
                    />
                </div>
            </div>
            <div className="search-btn-section">
                <button className="management-filter-btn" onClick={clearInput}> Xóa tất cả </button>
            </div>
        </>
    )
}

export default BooksFilterSection
