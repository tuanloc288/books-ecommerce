import "./header.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountManagementModal from "../client/Pages/Account/userManagement";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../reducers/apiReducer/signFormAPI/signOut";
import jwt_decode from "jwt-decode"
import { signIn } from "../../reducers/apiReducer/signFormAPI/signIn";
import HeaderCart from "./headerCart";
import cartSlice from "../../reducers/componentsReducer/carts/cartSlice";
import { cartDetailAPI } from "../../reducers/apiReducer/cartDetailAPI";
import { cartAPI } from "../../reducers/apiReducer/cartAPI";
import purchaseHistorySlice from "../../reducers/componentsReducer/purchaseHistory/purchaseHistorySlice";

const Header = () => {
  const dispatch = useDispatch()
  const cartList = useSelector(state => state.carts.cartList)

  const [subMenu , setSubMenu] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  let user = useSelector(state => state.signIn.data)
  
  useEffect(() => {
    if(user.user?.isRemembered){
      localStorage.setItem('refreshToken', document.cookie.split('refreshToken=')[1])
    }
    if(user.user){
      checkCart()
      setTimeout(() => {
        handleCartList(true)
      }, 2000)
    }
    else {
      handleCartList(false)
    }
  },[user])

  useEffect(() => {
    checkPreviousLogin()
  },[])

  useEffect(() => {
  }, [cartList])

  const handleCartList = async (logIn) => {
    if(logIn){
        let local = await cartDetailAPI.getCartDetail({cartID: user.user.userName})
        dispatch(cartSlice.actions.setCartList(!local.err ? local : []))
    }
    else {
        let local = JSON.parse(localStorage.getItem('guestCart'))
        if(local)
          dispatch(cartSlice.actions.setCartList(local))
    }
}

const checkCart = async () => {
  let cart = await cartAPI.getOneCart({cartID: user.user.userName})
  if(cart.err) {
      let guestCart = JSON.parse(localStorage.getItem('guestCart'))
      if(guestCart){
          const cartMsg = await cartAPI.createCart({userName: user.user.userName, totalAmount: 0})
          if(cartMsg.message)
              cart = await cartAPI.getOneCart({cartID: user.user.userName})
          for(let i = 0; i < guestCart.length; i++){
              await cartDetailAPI.createCartDetail({cartDetailID: user.user.userName.split('@')[0] + '-' + guestCart[i].productID, userName: user.user.userName,
              productID: guestCart[i].productID, price: guestCart[i].price, quantity: guestCart[i].quantity, discount: guestCart[i].discount, totalAmount: guestCart[i].totalAmount})
              let update = await cartAPI.updateCart({cartID: user.user.userName, data: {totalAmount: cart.totalAmount + (guestCart[i].totalAmount - (guestCart[i].totalAmount * guestCart[i].discount))}})
              if(update.message)
                  cart = await cartAPI.getOneCart({cartID: user.user.userName})
          }
          localStorage.removeItem('guestCart')
      }
  }
  else {
      let guestCart = JSON.parse(localStorage.getItem('guestCart'))
      if(guestCart){
          let cartDetail = await cartDetailAPI.getCartDetail({cartID: cart.userName})
          if(!cartDetail.err){
          for(let i = 0; i < guestCart.length; i++){
              let existed = false
              for(let index = 0; index < cartDetail.length; index++) {
              if(cartDetail[index].cartDetailID.split('-')[1] !== guestCart[i].productID){
                  existed = false
              }
              else {
                  existed = cartDetail[index]
                  break
              }
              }
              if(typeof existed !== 'object'){
                  const cartDetailMsg = await cartDetailAPI.createCartDetail({cartDetailID: cart.userName.split('@')[0] + '-' + guestCart[i].productID, userName: cart.userName, productID: guestCart[i].productID, price: guestCart[i].price, quantity: guestCart[i].quantity, discount: guestCart[i].discount, totalAmount: guestCart[i].price * guestCart[i].quantity})
                  if(cartDetailMsg.message) {
                      cartDetail = await cartDetailAPI.getCartDetail({cartID: cart.userName}) 
                  } 
                  const cartMsg = await cartAPI.updateCart({cartID: cart.userName, data: {totalAmount: cart.totalAmount + (guestCart[i].totalAmount - (guestCart[i].totalAmount * guestCart[i].discount))}})
                  if(cartMsg.message){
                      cart = await cartAPI.getOneCart({cartID: cart.userName})
                  } 
              }
              else {
                  const cartDetailMsg = await cartDetailAPI.updateCartDetail({cartDetailID: existed.cartDetailID, data: {quantity: existed.quantity + guestCart[i].quantity, totalAmount: (existed.totalAmount + guestCart[i].totalAmount)}})
                  if(cartDetailMsg.message) {   
                      cartDetail = await cartDetailAPI.getCartDetail({cartID: cart.userName})
                  }
                  const cartMsg = await cartAPI.updateCart({cartID: cart.userName, data: {totalAmount: cart.totalAmount + (guestCart[i].totalAmount - (guestCart[i].totalAmount * guestCart[i].discount))}})
                  if(cartMsg.message){
                      cart = await cartAPI.getOneCart({cartID: cart.userName})
                  }    
              }
          }
          localStorage.removeItem('guestCart')
          }
      }
  }
}

  const checkPreviousLogin = async () => {
    let token = document.cookie.split('refreshToken=')[1]
    if(token){
      let decodedToken = jwt_decode(token)
      await dispatch(signIn({userName: decodedToken.userName, password: decodedToken.password, isRemembered: decodedToken.isRemembered}))
    }
  }

  const handleMobileMenu = () => {
    setMobileMenu(!mobileMenu)
  }

  const closeMobileMenu = () => {
    setMobileMenu(false)
  }

  const handleSubMenu = () => {

    const sm = document.getElementById('sub-menu')
    let active = document.querySelectorAll('.header-button')

    active = active[active.length - 1]

    if(!subMenu) {
      sm.style.display = 'block'
      active.classList.add('header-button-active')
    }
    else {
      sm.style.display = 'none'
      active.classList.remove('header-button-active')
    }
    
    sm.addEventListener("mouseleave" , () => {
      setSubMenu(false)
      sm.style.display = 'none'
      active.classList.remove('header-button-active')
    }, {once: true})

    setSubMenu(!subMenu)
  } 

  const handleSubMenu2= (props) => {
    const sm = document.getElementById('sub-menu')
    
    props.bool ? sm.style.display = 'block' : sm.style.display = 'none'
    
    sm.addEventListener('mouseleave' , () => {
      sm.style.display = 'none'
    } , {once: true})

  }

  const handleLogInBtn = () => {
    const sm = document.getElementById('sub-menu')
    let active = document.querySelectorAll('.header-button')
    active = active[active.length - 1]
    setSubMenu(false)
    sm.style.display = 'none'
    active.classList.remove('header-button-active')
  }

  const handleLogout = async () => {
      await signOut(dispatch)
      dispatch(cartSlice.actions.setCartList([]))
      dispatch(purchaseHistorySlice.actions.setBillID(''))
      dispatch(purchaseHistorySlice.actions.setBillList([]))
      dispatch(purchaseHistorySlice.actions.setBillDetailList([]))
  }
  
  const handleAccountModal= () => {
    document.getElementById('account-management-modal-wrapper').classList.add('showModal')
    document.getElementById('account-management-modal-container').classList.add('showModal')
    document.body.classList.add('modal-open')
  }

  return (
    <>
      <div className="header-container"> 

      <div id="account-management-modal-wrapper">
        <div id='account-management-modal-container'>
          <AccountManagementModal 
            username = {user.user?.userName}
          />
        </div>
      </div>

        <Link to='/' className="header-logo-container" onClick={closeMobileMenu}>
          <div className="header-logo"></div>
          <p className="header-logo-name"> BOOKIVERSE </p>
        </Link>
        <div id="header-menu-icon" onClick={handleMobileMenu}>
          <i className={mobileMenu ? 'fas fa-times' : 'fa-solid fa-bars'}></i>
        </div>
        <div className={mobileMenu ? 'header-nav-items active' : 'header-nav-items'}>
          <Link to='/products' className="header-button" onClick={closeMobileMenu}> Sách </Link>
          {
              user.isAdmin ? <Link to='/management' className="header-button" onClick={closeMobileMenu}> Quản lý </Link> : <> </>
          }
          <Link to='/carts' className="header-button header-cart" onClick={closeMobileMenu}> <i className="fa-solid fa-cart-arrow-down"></i> <HeaderCart items={cartList.length}/> </Link>
          {
            Object.keys(user).length === 0 || user.err ? <Link to='/signForm' className="header-button" onClick={() => {
                                    closeMobileMenu()
                                  }}> Đăng nhập 
                                </Link>
                              : <div className="header-button" onMouseEnter={() => {
                                  if(window.innerWidth < 900)
                                    handleSubMenu2({bool: true})
                              }}> 
                                  <span className="header-isLogin" onClick={() => {
                                      if(window.innerWidth > 900) 
                                        handleSubMenu() 
                                    }}> {user?.isAdmin ? 'Admin' : user.user?.userName.split('@')[0]} 
                                    <i className="fa-sharp fa-solid fa-caret-down"/>
                                    </span>
                                  <ul id='sub-menu'>
                                    <li onClick={() => {
                                      closeMobileMenu()
                                      handleAccountModal()
                                      }}> Quản lý tài khoản </li>
                                    <li onClick={closeMobileMenu}> <Link to='/purchaseHistory'>  Lịch sử mua hàng </Link> </li>
                                    <li onClick={() => {
                                      closeMobileMenu()
                                      handleLogout()
                                      handleLogInBtn()
                                    }}> Đăng xuất </li>
                                  </ul> 
                              </div>
          }
        </div>
        
      </div>
    </>
  );
};

export default Header;
