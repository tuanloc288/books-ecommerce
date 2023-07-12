import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./products.css";
import { toast } from "react-toastify";
import productSlice from "../../../../reducers/componentsReducer/products/productSlice";
import { removeVietnameseTones } from "../../../others/utilsAPI";

const ProductSearch = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.getProducts.cusProductsList);
  const categoryList = useSelector(
    (state) => state.products.categoryProductsList
  );

  const [formData, setFormData] = useState({
    bookName: "",
    authorName: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleSearchInput = (e) => {
    setFormData(() => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleString = (str) => {
    str = str.replace(/ + /g," ");
    str = str.trim();
    return str.toLowerCase()
  }

  const handleSearching = (e) => {
    e.preventDefault();
    if (
      formData.bookName.trim() === "" &&
      formData.authorName.trim() === "" &&
      formData.minPrice.trim() === "" &&
      formData.maxPrice.trim() === ""
    ) {
      toast.warning("Bạn chưa nhập mục tìm kiếm!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      let local = categoryList.length !== 0 ? categoryList : productList;
      if (local.length !== 0) {
        if (formData.bookName !== "") {
          local = local.filter((item) =>
            removeVietnameseTones(handleString(item.bookname)).includes(removeVietnameseTones(handleString(formData.bookName)))
          );
        }
        if (formData.authorName !== "") {
          local = local.filter((item) =>
            removeVietnameseTones(handleString(item.author)).includes(removeVietnameseTones(handleString(formData.authorName))) 
          );
        }
        if (formData.minPrice !== "") {
          local = local.filter(
            (item) =>
              (item.price - (item.price * item.discount)) >= formData.minPrice
          );
        }
        if (formData.maxPrice !== "") {
          local = local.filter(
            (item) =>
              (item.price - (item.price * item.discount)) <= formData.maxPrice
          );
        }
      }
      local.length !== 0 ? dispatch(productSlice.actions.setSearchResult(local)) && dispatch(productSlice.actions.setBasicSort('default')): (
        toast.warning('Không tìm thấy sản phẩm nào thỏa điều kiện!', {
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
      )
    }
  };

  const handleClearSearch = () => {
    setFormData({
      bookName: "",
      authorName: "",
      minPrice: "",
      maxPrice: "",
    });
    categoryList.length !== 0 ? dispatch(productSlice.actions.setFilterList(categoryList)) : dispatch(productSlice.actions.setFilterList([]))
    dispatch(productSlice.actions.setSearchResult([]))
    dispatch(productSlice.actions.setBasicSort('default'))
  };

  return (
    <>
      <form className="filter-section" onSubmit={handleSearching}>
        <div className="search-by-object">
          <div className="sub-title"> Tên sách:</div>
          <input
            className="search-input"
            name="bookName"
            placeholder="Tìm tên sách..."
            onChange={handleSearchInput}
            value={formData.bookName}
          />
        </div>

        <div className="search-by-object">
          <div className="sub-title"> Tên tác giả:</div>
          <input
            className="search-input"
            name="authorName"
            placeholder="Tìm tên tác giả..."
            onChange={handleSearchInput}
            value={formData.authorName}
          />
        </div>

        <div className="search-by-object">
          <div className="sub-title"> Giá thấp nhất:</div>
          <input
            className="search-input"
            name="minPrice"
            placeholder="Tìm giá thấp nhất..."
            onChange={handleSearchInput}
            value={formData.minPrice}
          />
        </div>

        <div className="search-by-object">
          <div className="sub-title"> Giá cao nhất:</div>
          <input
            className="search-input"
            name="maxPrice"
            placeholder="Tìm giá cao nhất..."
            onChange={handleSearchInput}
            value={formData.maxPrice}
          />
        </div>

        <div id="filter-btn-section">
          <button className="filter-btn" onClick={handleClearSearch} type='reset'>
            Reset
          </button>
          <button type="submit" className="filter-btn">
            Tìm
          </button>
        </div>
      </form>
    </>
  );
};

export default ProductSearch;
