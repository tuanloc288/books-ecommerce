import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import productSlice from '../../../../reducers/componentsReducer/products/productSlice'
import './products.css'

const CategoryList = () => {
    const categoriesList = useSelector(state => state.getCategories.categoriesList)
    const productsList = useSelector(state => state.getProducts.cusProductsList)
    const [categoryTypes, setCategoryTypes] = useState([])
    const [flag ,setFlag] = useState(false)
    const [activeCategory, setActiveCategory] = useState(-1)
    const dispatch = useDispatch()

    useEffect(() => {
        if(categoriesList.length !== 0 && productsList.length !== 0 && Object.keys(categoryTypes).length === 0){
            handleCategoryList()
        }
    },[categoriesList, productsList])

    const handleCategoryList = () => {
        let local = []
        for(let data in categoriesList){
            local[categoriesList[data].name] = []
            for(let pData in productsList){
                if(productsList[pData].category === categoriesList[data].categoryID){
                    local[categoriesList[data].name].push(productsList[pData])
                }
            }
        } 
        setCategoryTypes(local)
        setFlag(true)
    }

    return (
        <div className='category-list'>
            {
                !flag ? <div className='loader' style={{
                    display: 'flex',
                    justifySelf: 'center'
                }}></div> : (
                    categoriesList.map((category, index) => { 
                        return (
                            <div key={category.categoryID} className='category-type-row'>
                                <div className={`category-type ${index === activeCategory ? 'active' : ''}`} onClick={() => {
                                    dispatch(productSlice.actions.setCategoryProductsList(categoryTypes[category.name]))
                                    dispatch(productSlice.actions.setBasicSort('default'))
                                    dispatch(productSlice.actions.setProductsHeader(category.name))
                                    dispatch(productSlice.actions.setSearchResult([]))
                                    setActiveCategory(index)
                                }}>
                                    <span> {category.name} </span>
                                    <span> {categoryTypes[category.name].length} </span>
                                </div>
                                {
                                    index === activeCategory ? <span id='clear-category' onClick={() => {
                                        dispatch(productSlice.actions.setCategoryProductsList([]))
                                        dispatch(productSlice.actions.setBasicSort('default'))
                                        dispatch(productSlice.actions.setProductsHeader('Tất cả'))
                                        setActiveCategory(-1)
                                    }}> X </span> : null
                                }
                            </div>
                        )
                    })
                ) 
            }
        </div>
    )
}

export default CategoryList