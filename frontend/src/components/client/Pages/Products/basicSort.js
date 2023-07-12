import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import productSlice from "../../../../reducers/componentsReducer/products/productSlice";
import "./products.css";

const ProductBasicSort = () => {
    const productList = useSelector(state => state.getProducts.cusProductsList)
    const categoryList = useSelector(state => state.products.categoryProductsList)
    const searchResult = useSelector(state => state.products.searchProductsList)
    const selected = useSelector(state => state.products.basicSort)
    const dispatch = useDispatch()

    useEffect(() => {
        handleBasicSort()
    }, [selected])


  const handleBasicSort = () => {
    let list = searchResult.length !== 0 ? searchResult : (categoryList.length !== 0) ? categoryList : productList;
    let local = [...list];
    document.getElementById('products-sort-selection').value = selected
    switch (selected) {
      case "increase": {
        dispatch(
          productSlice.actions.setFilterList(
            local.sort((a, b) => {
              let aPrice = a.price - a.price * a.discount;
              let bPrice = b.price - b.price * b.discount;
              return aPrice - bPrice;
            })
          )
        );
        break;
      }
      case "decrease": {
        dispatch(
          productSlice.actions.setFilterList(
            local.sort((a, b) => {
              let aPrice = a.price - a.price * a.discount;
              let bPrice = b.price - b.price * b.discount;
              return bPrice - aPrice;
            })
          )
        );
        break;
      }
      case "discount": {
        let temp = local.filter((item) => item.discount !== 0)
        if(temp.length !== 0){
          dispatch(productSlice.actions.setFilterList(temp))
        }
        else {
          toast.warning('Không có sách nào đang giảm giá!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            draggable: true,
            progress: undefined,
            theme: "dark",    
          })
        }
        break;
      }
      default: {
        searchResult.length !== 0 ? dispatch(productSlice.actions.setFilterList(searchResult)) : dispatch(productSlice.actions.setFilterList(categoryList))
        break;
      }
    }
  };

  return (
    <>
      <div id="products-sort">
        <span> Sắp xếp theo: </span>
        <select
            name="basicSortSelection"
            id="products-sort-selection"
            onChange={(e) => dispatch(productSlice.actions.setBasicSort(e.target.value))}
        >
        <option value="default"> Tất cả </option>
        <option value="increase"> Giá tăng dần </option>
        <option value="decrease"> Giá giảm dần </option>
        <option value="discount"> Đang giảm giá </option>
      </select>
    </div>
    </>
  );
};

export default ProductBasicSort;
