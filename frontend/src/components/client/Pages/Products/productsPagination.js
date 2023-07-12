import "./products.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import productSlice from "../../../../reducers/componentsReducer/products/productSlice";

const ProductsPagination = () => {
  const productsList = useSelector((state) => state.getProducts.cusProductsList);
  const filterList = useSelector((state) => state.products.filterProductsList);
  const displayPerPage = useSelector((state) => state.products.displayPerPage);
  const totalPages = useSelector((state) =>
    state.products.totalPages !== 0
      ? state.products.totalPages
      : Math.ceil(productsList.length / displayPerPage)
  );
  const [activePage, setActivePage] = useState(1);
  let [display, setDisplay] = useState({
    pages: [],
  });
  const dispatch = useDispatch();
  useEffect(() => {
    let localPages = [];
    if (totalPages > 5) {
      if (activePage <= 3) {
        for (let index = 1; index <= 5; index++) {
          localPages.push(index);
        }
      } else if (activePage === totalPages - 2) {
        for (let index = activePage - 2; index <= totalPages; index++) {
          localPages.push(index);
        }
      } else if (activePage === totalPages - 1 || activePage === totalPages) {
        for (let index = totalPages - 4; index <= totalPages; index++) {
          localPages.push(index);
        }
      } else {
        for (let index = activePage - 3; index <= activePage + 3; index++) {
          localPages.push(index);
        }
      }
    } else {
      for (let index = 1; index <= totalPages; index++) {
        localPages.push(index);
      }
    }
    renderBooks(localPages);
  }, [activePage]);

  useEffect(() => {
    if (productsList.length !== 0 && display.pages.length === 0) {
      handleProductList();
    }
  }, [productsList]);

  useEffect(() => {
    if (filterList.length === 0 && productsList.length !== 0) {
      handleProductList();
      setActivePage(1);
    }
    if (filterList.length !== 0) {
      let localPages = [];
      let limit;
      totalPages <= 5 ? (limit = totalPages) : (limit = 5);
      for (let index = 1; index <= limit; index++) {
        localPages.push(index);
      }
      let localDisplay = [];
      for (
        let index = (activePage - 1) * displayPerPage;
        index < activePage * displayPerPage;
        index++
      ) {
        if (!filterList[index]) {
          break;
        } else {
          localDisplay.push(filterList[index]);
        }
      }
      setDisplay({
        pages: localPages,
      });
      dispatch(productSlice.actions.setDisplayList(localDisplay));
      setActivePage(1);
    }
  }, [filterList]);

  const handleProductList = () => {
    let localPages = [];
    for (let index = 1; index <= 5; index++) {
      localPages.push(index);
    }
    let localDisplay = [];
    for (
      let index = (activePage - 1) * displayPerPage;
      index < activePage * displayPerPage;
      index++
    ) {
      localDisplay.push(productsList[index]);
    }
    setDisplay({
      pages: localPages,
    });
    dispatch(productSlice.actions.setDisplayList(localDisplay));
  };

  const renderBooks = (pages) => {
    let list = filterList.length !== 0 ? filterList : productsList;
    if (list.length !== 0) {
      let localDisplay = [];
      let i = 0;
      let limit;
      activePage === totalPages
        ? (limit = list.length)
        : (limit = activePage * displayPerPage);
      for (
        let index = (activePage - 1) * displayPerPage;
        index < limit;
        index++
      ) {
        localDisplay[i] = list[index];
        ++i;
      }
      setDisplay({
        pages,
      });
      dispatch(productSlice.actions.setDisplayList(localDisplay));
    }
  };

  return (
    <ul className="pagination">
      {activePage !== 1 ? (
        <li
          onClick={() => {
            setActivePage(activePage - 1);
          }}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </li>
      ) : null}
      {
        (activePage - 11) >= 1 ? (
            <>
                <li
                    className={`${activePage === 1 ? "active" : ""}`}
                    onClick={() => {
                        setActivePage(1);
                    }}
                >
                    {1}
                </li>
                <li id="page-dots">...</li>
            </>
        ) : null
      }
      {display.pages.map((page, index) => {
        return (
          <li
            className={`${page === activePage ? "active" : ""}`}
            key={index}
            onClick={() => {
              setActivePage(page);
            }}
          >
            {page}
          </li>
        );
      })}
      {
        totalPages >= 10 && (activePage + 11) <= totalPages ? (
            <>
                <li id="page-dots">...</li>
                <li
                    className={`${totalPages === activePage ? "active" : ""}`}
                    onClick={() => {
                        setActivePage(totalPages);
                    }}
                >
                    {totalPages}
                </li>
            </>
        ) : null
      }
      {activePage !== totalPages ? (
        <li
          onClick={() => {
            setActivePage(activePage + 1);
          }}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </li>
      ) : null}
    </ul>
  );
};

export default ProductsPagination;
