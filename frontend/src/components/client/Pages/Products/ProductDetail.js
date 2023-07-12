import "./productDetail.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toMoney } from "../../../others/utilsAPI";
import { toast, ToastContainer } from "react-toastify";
import { cartAPI } from "../../../../reducers/apiReducer/cartAPI";
import { cartDetailAPI } from "../../../../reducers/apiReducer/cartDetailAPI";
import cartSlice from "../../../../reducers/componentsReducer/carts/cartSlice";

const ProductDetail = () => {
  const productsList = useSelector(
    (state) => state.getProducts.cusProductsList
  );
  const categoriesList = useSelector(
    (state) => state.getCategories.categoriesList
  );
  const cartList = useSelector((state) => state.carts.cartList);
  const user = useSelector((state) => state.signIn.data);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { productID } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let local = JSON.parse(localStorage.getItem("books"));
    for (let i in local) {
      if (productID === local[i].bookid) {
        setProduct(local[i]);
        break;
      }
    }
    return () => {
      setQuantity(1);
    };
  }, [productID]);

  const handleQuantity = (q) => {
    if (q < 1 || q === "") {
      toast.error(`Số lượng không hợp lệ!`, {
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
    } else if (q <= product.inStock - product.purchased) {
      setQuantity(q);
    } else {
      toast.error(
        `Số lượng hiện tại của sách chỉ còn ${
          product.inStock - product.purchased
        } quyển! Mong bạn thông cảm`,
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
    }
  };

  const handleBuy = async () => {
    if (product.inStock - product.purchased <= 0) {
      toast.error(
        `Số lượng hiện tại của sách chỉ còn ${
          product.inStock - product.purchased
        } quyển! Mong bạn thông cảm`,
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
    } else {
      if (user.user) {
        let cart = await cartAPI.getOneCart({ cartID: user.user.userName });
        if (cart.err) {
          await cartAPI.createCart({
            userName: user.user.userName,
            totalAmount:
              product.price * quantity -
              product.price * product.discount * quantity,
          });
          await cartDetailAPI.createCartDetail({
            cartDetailID: user.user.userName.split("@")[0] + "-" + productID,
            userName: user.user.userName,
            productID,
            price: product.price,
            quantity,
            discount: product.discount,
            totalAmount: product.price * quantity,
          });
          let detail = await cartDetailAPI.getCartDetail({
            cartID: user.user.userName,
          });
          if (!detail.err) {
            dispatch(cartSlice.actions.setCartList(detail));
          }
        } else {
          if (cartList.length !== 0) {
            let flag = false;
            for (let i in cartList) {
              if (cartList[i].productID === productID) {
                flag = true;
                let cartDetail = await cartDetailAPI.getCartDetail({
                  cartID: user.user.userName,
                });
                for (let j in cartDetail) {
                  if (cartDetail[j].productID === productID) {
                    let updateMsg = await cartDetailAPI.updateCartDetail({
                      cartDetailID: cartDetail[j].cartDetailID,
                      data: {
                        quantity: cartDetail[j].quantity + parseInt(quantity),
                        totalAmount:
                          cartDetail[j].totalAmount + product.price * parseInt(quantity),
                      },
                    });
                    if (updateMsg.message) {
                      await cartAPI.updateCart({
                        cartID: user.user.userName,
                        data: {
                          totalAmount:
                            cart.totalAmount +
                            (product.price * quantity -
                              product.price * quantity * product.discount),
                        },
                      });
                      let detail = await cartDetailAPI.getCartDetail({
                        cartID: user.user.userName,
                      });
                      if (!detail.err) {
                        dispatch(cartSlice.actions.setCartList(detail));
                      }
                    }
                    break;
                  }
                }
              }
            }
            if (!flag) {
              const cartDetailMsg = await cartDetailAPI.createCartDetail({
                cartDetailID:
                  user.user.userName.split("@")[0] + "-" + productID,
                userName: user.user.userName,
                productID,
                price: product.price,
                quantity,
                discount: product.discount,
                totalAmount: product.price * quantity,
              });
              if (cartDetailMsg.message) {
                await cartAPI.updateCart({
                  cartID: user.user.userName,
                  data: {
                    totalAmount:
                      cart.totalAmount +
                      (product.price * quantity -
                        product.price * quantity * product.discount),
                  },
                });
              }
              let newCart = await cartDetailAPI.getCartDetail({
                cartID: user.user.userName,
              });
              if (!newCart.err) {
                dispatch(cartSlice.actions.setCartList(newCart));
              }
            }
          }
        }
      } else {
        let guestCart = localStorage.getItem("guestCart");
        if (!guestCart) {
          localStorage.setItem(
            "guestCart",
            JSON.stringify([
              {
                productID,
                quantity,
                price: product.price,
                discount: product.discount,
                totalAmount: product.price * quantity,
              },
            ])
          );
        } else {
          let flag = false;
          guestCart = JSON.parse(guestCart);
          for (let index = 0; index < guestCart.length; index++) {
            if (guestCart[index].productID === productID) {
              flag = true;
              guestCart[index].quantity += quantity;
              guestCart[index].totalAmount += product.price * quantity;
              localStorage.setItem("guestCart", JSON.stringify(guestCart));
              break;
            }
          }
          if (!flag) {
            let local = guestCart;
            local.push({
              productID,
              quantity,
              price: product.price,
              discount: product.discount,
              totalAmount: product.price * quantity,
            });
            localStorage.setItem("guestCart", JSON.stringify(local));
          }
        }
        let local = JSON.parse(localStorage.getItem("guestCart"));
        if (local) dispatch(cartSlice.actions.setCartList(local));
      }
      let books = JSON.parse(localStorage.getItem("books"));
      for (let i in books) {
        if (books[i].bookid === productID) {
          books[i].purchased += parseInt(quantity);
          localStorage.setItem("books", JSON.stringify(books));
          break;
        }
      }
      return navigate("/carts");
    }
  };

  return (
    <>
      {Object.keys(product).length !== 0 ? (
        <div id="product-detail-wrapper">
          <div id="product-detail-left">
            <div id="product-detail-left-header"> Sách cùng thể loại</div>
            <div id="product-detail-left-content">
              {productsList.map((item) => {
                if (
                  item.category === product.category &&
                  item.bookid !== product.bookid
                ) {
                  return (
                    <Link
                      key={item.bookid}
                      to={`/products/${item.bookid}`}
                      id="product-detail-left-row"
                    >
                      <div id="product-detail-left-row-image-container">
                        <img
                          id="product-detail-left-row-image"
                          src={item.image}
                          alt="product detail left img"
                        ></img>
                      </div>
                      <div id="product-detail-left-row-title">
                        {" "}
                        {item.bookname} <br />{" "}
                        <span
                          style={{
                            color: "var(--sub-color)",
                          }}
                        >
                          {" "}
                          Tác giả: {item.author}{" "}
                        </span>{" "}
                      </div>
                    </Link>
                  );
                }
              })}
            </div>
          </div>
          <div id="product-detail-right">
            <div id="product-detail-right-top-section">
              <img
                id="product-detail-right-top-image"
                src={product.image}
              ></img>
              <div id="product-detail-right-top-content">
                <div id="product-detail-right-top-title">
                  {" "}
                  {product.bookname}{" "}
                </div>
                <div id="product-detail-right-top-author">
                  Tác giả:
                  <span
                    style={{
                      marginLeft: 3,
                      marginRight: 3,
                      color: "var(--letter-color)",
                    }}
                  >
                    {" "}
                    {product.author}{" "}
                  </span>
                  | Thể loại:{" "}
                  <span
                    style={{
                      color: "var(--letter-color)",
                    }}
                  >
                    {categoriesList.map((item) => {
                      if (item.categoryID === product.category)
                        return item.name;
                    })}{" "}
                  </span>
                </div>
                <div id="product-detail-right-top-price-section">
                  <div id="product-detail-right-top-af">
                    {" "}
                    {toMoney(
                      product.price - product.price * product.discount
                    )}đ{" "}
                  </div>
                  {product.discount !== 0 ? (
                    <div id="product-detail-right-top-bf">
                      {" "}
                      {toMoney(product.price)}đ{" "}
                    </div>
                  ) : null}
                </div>
                <div id="product-detail-right-top-cart">
                  <div id="product-detail-right-top-quantity-section">
                    <input
                      id="product-detail-right-top-quantity-input"
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        handleQuantity(parseInt(e.target.value));
                      }}
                    />
                    <div>
                      <div
                        className="product-detail-right-top-quantity"
                        onClick={() => handleQuantity(quantity + 1)}
                      >
                        {" "}
                        +{" "}
                      </div>
                      <div
                        className="product-detail-right-top-quantity"
                        style={{
                          borderBottom: "1px solid rgba(110,110,110,1)",
                        }}
                        onClick={() => handleQuantity(quantity - 1)}
                      >
                        {" "}
                        -{" "}
                      </div>
                    </div>
                    <button id="product-detail-btn-buy" onClick={handleBuy}>
                      {" "}
                      Mua ngay{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div id="product-detail-right-bottom-section">
              <div id="product-detail-right-bottom-header">
                {" "}
                Thông tin chi tiết{" "}
              </div>
              <div id="product-detail-right-bottom-des">
                {" "}
                {product.description !== ""
                  ? product.description
                  : "{Mục này chưa có thông tin}"}{" "}
              </div>
              <div className="product-detail-right-bottom-info">
                {" "}
                Giảm giá:{" "}
                <span className="product-detail-right-bottom-info-main">
                  {" "}
                  {product.discount * 100}%{" "}
                </span>{" "}
              </div>
              <div className="product-detail-right-bottom-info">
                {" "}
                Nhà xuất bản:{" "}
                <span className="product-detail-right-bottom-info-main">
                  {" "}
                  {product.supplier !== ""
                    ? product.supplier
                    : "{Mục này chưa có thông tin}"}{" "}
                </span>{" "}
              </div>
              <div className="product-detail-right-bottom-info">
                {" "}
                Nhà phát hành:{" "}
                <span className="product-detail-right-bottom-info-main">
                  {" "}
                  {product.issuers !== ""
                    ? product.issuers
                    : "{Mục này chưa có thông tin}"}{" "}
                </span>{" "}
              </div>
              <div className="product-detail-right-bottom-info">
                {" "}
                Ngày phát hành:{" "}
                <span className="product-detail-right-bottom-info-main">
                  {" "}
                  {product.datePublic !== ""
                    ? product.datePublic
                    : "{Mục này chưa có thông tin}"}{" "}
                </span>{" "}
              </div>
              <div className="product-detail-right-bottom-info">
                {" "}
                Loại bìa:{" "}
                <span className="product-detail-right-bottom-info-main">
                  {" "}
                  {product.coverType !== ""
                    ? product.coverType
                    : "{Mục này chưa có thông tin}"}{" "}
                </span>{" "}
              </div>
              <div className="product-detail-right-bottom-info">
                {" "}
                Số trang sách:{" "}
                <span className="product-detail-right-bottom-info-main">
                  {" "}
                  {product.pagesNumber !== ""
                    ? product.pagesNumber
                    : "{Mục này chưa có thông tin}"}{" "}
                </span>{" "}
              </div>
              <div className="product-detail-right-bottom-info">
                {" "}
                Kích cỡ sách:{" "}
                <span className="product-detail-right-bottom-info-main">
                  {" "}
                  {product.bookSize !== ""
                    ? product.bookSize
                    : "{Mục này chưa có thông tin}"}{" "}
                </span>{" "}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loader"></div>
      )}
      <ToastContainer />
    </>
  );
};

export default ProductDetail;
