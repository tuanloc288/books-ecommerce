import './products.css'
import ProductList from './productList'
import CategoryList from './categoryList'
import ProductsPagination from './productsPagination'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import productSlice from '../../../../reducers/componentsReducer/products/productSlice'
import ProductBasicSort from './basicSort'
import ProductSearch from './productSearch'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

const ProductsListing = () => {
    const header = useSelector(state => state.products.productsHeader)
    const dispatch = useDispatch()

    useEffect(() => {
        return () => {
            dispatch(productSlice.actions.setBasicSort('default'))
            dispatch(productSlice.actions.setFilterList([]))
            dispatch(productSlice.actions.setSearchResult([]))
            dispatch(productSlice.actions.setCategoryProductsList([]))
        }
     }, [])

    return (
        <div>
            
            <div className='book-page'> Bookiverse </div>
            
            <div className='products-container'>
                <div className='products-left-section'>
                    <div className='category-scroll-section'>
                        
                        <div className="category-section">
                            <div className='left-title'> Thể loại </div>
                            <CategoryList/>
                        </div>

                        <div className="search-section">
                            <div className="left-title">
                                Tìm kiếm
                            </div>
                            
                            <ProductSearch/>

                        </div>

                    </div>
                </div>

                <div className='products-right-section'>
                    <div id='products-header'>
                        {
                            <>
                                <div id='products-title'> {header} </div> 
                                <ProductBasicSort/>
                            </>
                        }
                    </div>
                    {
                        <ProductList/>
                    }
                    <div className='products-pagination'>
                        <ProductsPagination/>
                    </div>
                </div>
            
            </div>
            <ToastContainer/>
        </div>

    )
}

export default ProductsListing
