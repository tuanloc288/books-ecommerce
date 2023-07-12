import "./products.css";
import ProductCard from "./ProductCard";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import productSlice from "../../../../reducers/componentsReducer/products/productSlice";

const ProductsList = () => {
  const displayList = useSelector((state) => state.products.displayList);
  const all = useSelector((state) => state.getProducts.cusProductsList);
  const perRow = useSelector((state) => state.products.perRow);
  const dispatch = useDispatch();

  useEffect(() => {
    handlePerRow();
  }, [displayList]);

  const handlePerRow = () => {
    switch (displayList.length) {
      case 3: {
        dispatch(productSlice.actions.setPerRow("auto auto auto"));
        break;
      }
      case 2: {
        dispatch(productSlice.actions.setPerRow("auto auto"));
        break;
      }
      case 1: {
        dispatch(productSlice.actions.setPerRow("auto"));
        break;
      }
      default: {
        dispatch(productSlice.actions.setPerRow("auto auto auto auto"));
        break;
      }
    }
  };

  return (
    <>
      <div
        className="products-list-container"
        style={{
          "--perRow": perRow,
        }}
      >
        {displayList.length === 0
          ? all.map((item) => {
              return (
                <ProductCard
                  key={item.bookid}
                  bookID={item.bookid}
                  image={item.image}
                  bookName={item.bookname}
                  author={item.author}
                  price={item.price}
                  discount={item.discount}
                />
              );
            })
          : displayList.map((item) => {
              return (
                <ProductCard
                  key={item.bookid}
                  bookID={item.bookid}
                  image={item.image}
                  bookName={item.bookname}
                  author={item.author}
                  price={item.price}
                  discount={item.discount}
                />
              );
            })}
      </div>
    </>
  );
};

export default ProductsList;
