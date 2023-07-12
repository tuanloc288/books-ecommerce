import { Link } from "react-router-dom";
import { toMoney } from "../../../others/utilsAPI";
import "./products.css";
import { useDispatch, useSelector } from "react-redux";
import { cartAPI } from "../../../../reducers/apiReducer/cartAPI/index";
import { cartDetailAPI } from "../../../../reducers/apiReducer/cartDetailAPI/index";
import { toast } from "react-toastify";
import cartSlice from "../../../../reducers/componentsReducer/carts/cartSlice";

const ProductCard = (props) => {
  const user = useSelector((state) => state.signIn.data);
  const dispatch = useDispatch()

  const handleToast = (type, msg) => {
    switch (type) {
      case "success": {
        toast.success(msg, {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          pauseOnFocusLoss: false,
        });
        break;
      }
      case "warning": {
        toast.warning(msg, {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          pauseOnFocusLoss: false,
        });
        break;
      }
      default: {
        toast.error(msg, {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          pauseOnFocusLoss: false,
        });
        break;
      }
    }
  };

  const addToCart = async () => {
    let all = JSON.parse(localStorage.getItem("books"));
    for (let i = 0; i < all.length; i++) {
      if (all[i].bookid === props.bookID) {
        if(all[i].purchased === all[i].inStock){
          handleToast("error", `Mã sách:${props.bookID} hiện đã hết hàng!`);
          break;
        }
        else {
          if (user.user) {
            let cart = await cartAPI.getOneCart({ cartID: user.user.userName });
            if (cart.err) {
              let flag = false;
              const cartMsg = await cartAPI.createCart({
                userName: user.user.userName,
                totalAmount: (props.price - (props.price * props.discount)),
              });
              if (cartMsg.message) {
                cart = await cartAPI.getOneCart({ cartID: user.user.userName });
                flag = true;
              } else flag = false;
              const cartDetailMsg = await cartDetailAPI.createCartDetail({
                cartDetailID:
                  user.user.userName.split("@")[0] + "-" + props.bookID,
                userName: user.user.userName,
                productID: props.bookID,
                price: props.price,
                quantity: 1,
                discount: props.discount,
                totalAmount: props.price,
              });
              cartDetailMsg.message ? (flag = true) : (flag = false);
              flag
                ? handleToast("success", "Thêm vào giỏ hàng thành công!")
                : handleToast("error", "Thêm vào giỏ hàng thất bại!");
            } else {
              let cartDetail = await cartDetailAPI.getCartDetail({
                cartID: user.user.userName,
              });
              if (!cartDetail.err) {
                let existed = false;
                for (let index = 0; index < cartDetail.length; index++) {
                  if (
                    cartDetail[index].cartDetailID.split("-")[1] !== props.bookID
                  ) {
                    existed = false;
                  } else {
                    existed = cartDetail[index];
                    break;
                  }
                }
                let flag = false;
                if (typeof existed !== "object") {
                  const cartDetailMsg = await cartDetailAPI.createCartDetail({
                    cartDetailID:
                      user.user.userName.split("@")[0] + "-" + props.bookID,
                    userName: user.user.userName,
                    productID: props.bookID,
                    price: props.price,
                    quantity: 1,
                    discount: props.discount,
                    totalAmount: props.price,
                  });
                  if (cartDetailMsg.message) {
                    cartDetail = await cartDetailAPI.getCartDetail({
                      cartID: user.user.userName,
                    });
                    flag = true;
                  } else flag = false;
                  const cartMsg = await cartAPI.updateCart({
                    cartID: cart.userName,
                    data: { totalAmount: cart.totalAmount + (props.price - (props.price * props.discount)) },
                  });
                  if (cartMsg.message) {
                    cart = await cartAPI.getOneCart({
                      cartID: user.user.userName,
                    });
                    flag = true;
                  } else flag = false;
                  !flag
                    ? handleToast("error", "Thêm vào giỏ hàng thất bại!")
                    : handleToast("success", "Thêm vào giỏ hàng thành công!");
                } else {
                  const cartDetailMsg = await cartDetailAPI.updateCartDetail({
                    cartDetailID: existed.cartDetailID,
                    data: {
                      quantity: existed.quantity + 1,
                      totalAmount: existed.totalAmount + props.price,
                    },
                  });
                  if (cartDetailMsg.message) {
                    flag = true;
                    cartDetail = await cartDetailAPI.getCartDetail({
                      cartID: user.user.userName,
                    });
                  } else flag = false;
                  const cartMsg = await cartAPI.updateCart({
                    cartID: cart.userName,
                    data: { totalAmount: cart.totalAmount + (props.price - (props.price * props.discount)) },
                  });
                  if (cartMsg.message) {
                    flag = true;
                    cart = await cartAPI.getOneCart({
                      cartID: user.user.userName,
                    });
                  } else flag = false;
                  !flag
                    ? handleToast("error", "Thêm vào giỏ hàng thất bại!")
                    : handleToast("success", "Thêm vào giỏ hàng thành công!");
                }
              } else {
                handleToast("error", "Không tìm thấy chi tiết giỏ hàng!");
              }
            }
            let local = await cartDetailAPI.getCartDetail({cartID: user.user.userName})
            dispatch(cartSlice.actions.setCartList(!local.err ? local : []))
          } else {
            let guestCart = localStorage.getItem("guestCart");
            if (!guestCart) {
              localStorage.setItem(
                "guestCart",
                JSON.stringify([
                  {
                    productID: props.bookID,
                    quantity: 1,
                    price: props.price,
                    discount: props.discount,
                    totalAmount: props.price,
                  },
                ])
              );
              handleToast("success", "Thêm vào giỏ hàng thành công!");
            } else {
              let flag = false;
              guestCart = JSON.parse(guestCart);
              for (let index = 0; index < guestCart.length; index++) {
                if (guestCart[index].productID === props.bookID) {
                  flag = true;
                  guestCart[index].quantity += 1;
                  guestCart[index].totalAmount += props.price;
                  localStorage.setItem("guestCart", JSON.stringify(guestCart));
                  handleToast("success", "Thêm vào giỏ hàng thành công!");
                  break;
                }
              }
              if (!flag) {
                let local = guestCart;
                local.push({
                  productID: props.bookID,
                  quantity: 1,
                  price: props.price,
                  discount: props.discount,
                  totalAmount: props.price,
                });
                localStorage.setItem("guestCart", JSON.stringify(local));
                handleToast("success", "Thêm vào giỏ hàng thành công!");
              }
            }
            let local = JSON.parse(localStorage.getItem('guestCart'))
            if(local)
                dispatch(cartSlice.actions.setCartList(local))
          }
          all[i].purchased += 1;
          localStorage.setItem("books", JSON.stringify(all));
          break;
        }
      } 
    }
  };

  return (
    <>
      <div className="product-card">
        <Link
          to={`/products/${props.bookID}`}
          style={{
            textDecoration: "none",
            color: "var(--sub-color)",
          }}
        >
          <img
            src={props.image}
            className="product-card-image"
            alt="Product card"
          />
          <div className="product-card-title">{props.bookName}</div>
          <div className="product-card-author"> {props.author} </div>
        </Link>
        <div className="product-card-price-section">
          <div className="product-card-price">
            <span className="price-af-disc">
              {" "}
              {toMoney(props.price - props.price * props.discount)}đ{" "}
            </span>
            {props.discount !== 0 && (
              <span className="price-bf-disc"> {toMoney(props.price)}đ </span>
            )}
          </div>
          <i
            className="fa-sharp fa-solid fa-cart-plus product-card-btn"
            onClick={() => addToCart(props.bookID)}
          ></i>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
