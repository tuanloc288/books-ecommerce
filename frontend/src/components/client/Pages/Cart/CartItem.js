import "./cart.css";
import { toMoney } from "../../../others/utilsAPI";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartDetailAPI } from "../../../../reducers/apiReducer/cartDetailAPI";
import { toast } from "react-toastify";
import { cartAPI } from "../../../../reducers/apiReducer/cartAPI";
import cartSlice from '../../../../reducers/componentsReducer/carts/cartSlice'

const CartItem = (props) => {
  const productList = useSelector((state) => state.getProducts.cusProductsList);
  const categoriesList = useSelector(
    (state) => state.getCategories.categoriesList
  );
  const cartList = useSelector(state => state.carts.cartList)
  const user = useSelector(state => state.signIn.data)
  const [book, setBook] = useState({});
  const [quantity , setQuantity] = useState(props.quantity)
  const dispatch = useDispatch()

  useEffect(() => {
    if (productList.length !== 0 && Object.keys(book).length === 0) {
      for (let i in productList) {
        if (productList[i].bookid === props.bookID) {
          for (let y in categoriesList) {
            if (categoriesList[y].categoryID === productList[i].category) {
              let temp = { ...productList[i] };
              temp.category = categoriesList[y].name;
              setBook(temp);
              break;
            }
          }
        }
      }
    }
  }, [productList, book]);

  useEffect(() => {

  }, [quantity])

  const handleQuantity = async (type) => {
    switch(type){
        case 'des': {
            let q = quantity - 1
            setQuantity(q)
            let all = JSON.parse(localStorage.getItem('books'))
            for(let i in all){
              if(all[i].bookid === props.bookID){
                all[i].purchased -= 1
                if(all[i].purchased <= 0)
                  all[i].purchased = 0   
                localStorage.setItem("books", JSON.stringify(all));
                break
              }
            }
            if(q <= 0){
                toast.success(`Xóa thành công ${book.bookname} khỏi giỏ hàng!`, {
                  position: "bottom-center",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: false,
                  pauseOnFocusLoss: false,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                  pauseOnFocusLoss: false,
                });
                if(user.user){
                    let filter = cartList.filter(item => item.productID !== props.bookID)
                    dispatch(cartSlice.actions.setCartList(filter ? filter : []))    
                    await cartDetailAPI.deleteCartDetail({cartDetailID: props.cartDetailID})
                    let cart = await cartAPI.getOneCart({cartID: user.user.userName})
                    await cartAPI.updateCart({cartID: user.user.userName, data: {totalAmount: cart.totalAmount - (book.price - (book.price * book.discount))}})
                    cart = await cartAPI.getOneCart({cartID: user.user.userName})
                    if(cart.totalAmount <= 0){
                      await cartAPI.deleteCart({cartID: user.user.userName})    
                    }
                }
                else {
                    let cart = JSON.parse(localStorage.getItem('guestCart'))
                    if(cart){
                        for(let i = 0; i < cart.length; i++ ){
                            if(cart[i].productID === props.bookID){
                                let temp = cart.filter(item => item.productID !== props.bookID)
                                localStorage.setItem('guestCart', JSON.stringify(temp))
                                dispatch(cartSlice.actions.setCartList(temp ? temp : []))    
                                break
                            }
                        }
                    }
                }            
            }
            else {
                if(user.user){
                    await cartDetailAPI.updateCartDetail({cartDetailID: props.cartDetailID , data: {quantity: q, totalAmount: q*book.price}})
                    let cart = await cartAPI.getOneCart({cartID: user.user.userName})
                    await cartAPI.updateCart({cartID: user.user.userName, data: {totalAmount: cart.totalAmount - (book.price - (book.price * book.discount))}})
                    let local = await cartDetailAPI.getCartDetail({cartID: user.user.userName})
                    dispatch(cartSlice.actions.setCartList(!local.err ? local : []))    
                }
                else {
                    let cart = JSON.parse(localStorage.getItem('guestCart'))
                    if(cart){
                        for(let i = 0; i < cart.length; i++ ){
                            if(cart[i].productID === props.bookID){
                                cart[i].quantity -= 1
                                cart[i].totalAmount -= book.price 
                                localStorage.setItem('guestCart', JSON.stringify(cart))
                                dispatch(cartSlice.actions.setCartList(cart))
                                break
                            }
                        }
                    }
                }
            }
            break
        }
        case 'inc': {
            let q = quantity + 1
            if(q > (book.inStock - book.purchased)){
                toast.error(`Mã sách:${props.bookID} đã hết hàng!`, {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    pauseOnFocusLoss: false,
                  });
                  break
            }
            else {
                let all = JSON.parse(localStorage.getItem('books'))
                for(let i in all){
                  if(all[i].bookid === props.bookID){
                    all[i].purchased += 1
                    localStorage.setItem("books", JSON.stringify(all));
                    break
                  }
                }  
                setQuantity(q)
                if(user.user){
                    await cartDetailAPI.updateCartDetail({cartDetailID: props.cartDetailID , data: {quantity: q, totalAmount: q*book.price}})
                    let cart = await cartAPI.getOneCart({cartID: user.user.userName})
                    await cartAPI.updateCart({cartID: user.user.userName, data: {totalAmount: cart.totalAmount + (book.price - (book.price * book.discount))}})
                    let local = await cartDetailAPI.getCartDetail({cartID: user.user.userName})
                    dispatch(cartSlice.actions.setCartList(!local.err ? local : []))  
                }
                else {
                    let cart = JSON.parse(localStorage.getItem('guestCart'))
                    if(cart){
                        for(let i = 0; i < cart.length; i++ ){
                            if(cart[i].productID === props.bookID){
                                cart[i].quantity += 1
                                cart[i].totalAmount += book.price 
                                localStorage.setItem('guestCart', JSON.stringify(cart))
                                dispatch(cartSlice.actions.setCartList(cart))
                                break
                            }
                        }
                    }
                }
            }
            break
        }
    }
  }

  const removeItem = async () => {
    toast.success(`Xóa thành công ${book.bookname} khỏi giỏ hàng!`, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
      pauseOnFocusLoss: false,
    });
    if(user.user){
        let filter = cartList.filter(item => item.productID !== props.bookID)
        dispatch(cartSlice.actions.setCartList(filter ? filter : [])) 
        await cartDetailAPI.deleteCartDetail({cartDetailID: props.cartDetailID})
        let cart = await cartAPI.getOneCart({cartID: user.user.userName})
        await cartAPI.updateCart({cartID: user.user.userName, data: {totalAmount: cart.totalAmount - ((book.price - (book.price * book.discount)) * quantity)}})
        cart = await cartAPI.getOneCart({cartID: user.user.userName})
        if(cart.totalAmount <= 0){
          await cartAPI.deleteCart({cartID: user.user.userName})
        }
    }
    else {
        let cart = JSON.parse(localStorage.getItem('guestCart'))
        if(cart){
            for(let i = 0; i < cart.length; i++ ){
                if(cart[i].productID === props.bookID){
                    let temp = cart.filter(item => item.productID !== props.bookID)
                    localStorage.setItem('guestCart', JSON.stringify(temp))
                    dispatch(cartSlice.actions.setCartList(temp ? temp : []))    
                    break
                }
            }
        }
    }
    let all = JSON.parse(localStorage.getItem('books'))
    for(let i in all){
      if(all[i].bookid === props.bookID){
        all[i].purchased -= quantity
        if(all[i].purchased <= 0)
          all[i].purchased = 0   
        localStorage.setItem("books", JSON.stringify(all));
        break
      }
    }  
  }

  return (
    <>
      {Object.keys(book).length !== 0 ? (
        <div className="cart-item-container">
          <div className="cart-item-btn-rm" onClick={removeItem}>
            <i className="fa-sharp fa-solid fa-circle-xmark"></i>
          </div>
          <div className="cart-item">
            <img src={book.image} className="cart-item-img" alt="Cart item" />

            <div className="cart-item-info">
              <div className="cart-item-name"> {book.bookname} </div>
              <div className="cart-item-title">
                Thể loại:
                <span className="cart-item-category">{book.category}</span>
              </div>
              <div className="cart-item-title">
                Tác giả:
                <span className="cart-item-category"> {book.author} </span>
              </div>
              <div className="cart-item-title">
                Nhà xuất bản:
                <span className="cart-item-category"> {book.issuers !== '' ? book.issuers : '{Mục này hiện chưa có thông tin}'} </span>
              </div>
            </div>
          </div>

          <div className="cart-item-right-section">
            <div className="price-section">
              <div className="cart-item-price-af-disc">
                {toMoney(quantity * book.price - (quantity * book.price * book.discount))} đ
              </div>
              <div className="cart-item-price-bf-disc">
                <div className="price"> {toMoney(quantity * book.price)} đ |</div>
                <div className="disc"> -{book.discount * 100}% </div>
              </div>
            </div>
            <div className="quantity-section">
              <div className="des-btn" onClick={() => handleQuantity('des')}> - </div>
              <div className="quantity">
                {quantity}/{book.inStock - book.purchased}
              </div>
              <div className="inc-btn" onClick={() => handleQuantity('inc')}> + </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="cart-item-container">
          <div className="loader" style={{
            marginBottom: 20
          }}></div>
        </div>
      )}
    </>
  );
};

export default CartItem;
