import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { toMoney } from '../../../others/utilsAPI'
import { toast } from "react-toastify";
import { discountAccountAPI } from '../../../../reducers/apiReducer/discountOnAccountAPI'
import { refreshTokenHandler } from '../../../../reducers/apiReducer/signFormAPI/refreshToken'
import { billAPI } from '../../../../reducers/apiReducer/billAPI'
import { billDetailAPI } from '../../../../reducers/apiReducer/billDetailAPI/index'
import { cartAPI } from '../../../../reducers/apiReducer/cartAPI/index'
import { cartDetailAPI } from '../../../../reducers/apiReducer/cartDetailAPI/index'
import cartSlice from "../../../../reducers/componentsReducer/carts/cartSlice";
import purchaseHistorySlice from '../../../../reducers/componentsReducer/purchaseHistory/purchaseHistorySlice'

const CartRightSection = () => {
    const cartList = useSelector(state => state.carts.cartList)
    const billList = useSelector((state) => state.purchaseHistory.billList)
    const billDetail = useSelector(state => state.purchaseHistory.bilLDetailList)
    const user = useSelector(state => state.signIn.data)
  const [info, setInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [cartInfo, setCartInfo] = useState({
    listPrice: 0,
    discount: 0,
    netPrice: 0,
  })
  const dispatch = useDispatch()

  useEffect(() => {
    if(cartList.length === 0){
        setCartInfo({
            listPrice: 0,
            discount: 0,
            netPrice: 0,        
        })
    }
    else {
        let lPrice  = 0
        let dis  = 0
        let nPrice  = 0

        for(let i in cartList){
            lPrice += cartList[i].totalAmount
            dis += cartList[i].discount * cartList[i].totalAmount
            nPrice += (cartList[i].totalAmount - (cartList[i].discount * cartList[i].totalAmount))
        }
        setCartInfo({
            listPrice: lPrice,
            discount: dis,
            netPrice: nPrice,
        })
    }
  }, [cartList])

  const handleInput = (e) => {
    if(e.target.name === 'phone'){
        if(e.target.value.length < 10 || e.target.value.length > 11){
            e.target.setCustomValidity('Số điện thoại không hợp lệ (10 hoặc 11 số)!')
        }
        else e.target.setCustomValidity('')  
    }
    setInfo(() => ({
        ...info,
        [e.target.name]: e.target.value
    }))
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    if(cartList.length === 0){
      toast.error(`Giỏ hàng chưa có sản phẩm nào!`, {
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
    else {
      if(user.user){
        let billID = 1
        if(billList.length !== 0){
          for(let i in billList){
            if(parseInt(billList[i].billID.split('-')[1].split('B')[1]) > billID)
              billID = parseInt(billList[i].billID.split('-')[1].split('B')[1])
          }
          billID += 1
        }
        let newToken = await refreshTokenHandler(user.accessToken, dispatch)
        discountAccountAPI.updateDestroyDiscount({accessToken: newToken})
        let discount = await discountAccountAPI.getDiscountByUser({userName: user.user.userName, accessToken: newToken})
        let total = cartInfo.netPrice
        let totalDiscount = 0
        if(!discount.err){
          for(let i in discount){
            if(!discount[i]._destroy && discount[i].duration > new Date()){
              total = total - (total * discount[i].detail) 
              totalDiscount += discount[i].detail
            }
          }
        } 
        let id = user.user.userName.split('@')[0] + '-' + 'B' + (billID <= 9 ? `0${billID}` : billID) 
        let msg = await billAPI.createBill(
          {
            accessToken: newToken,
            data: {
              billID: id,
              totalAmount: total,
              userName: user.user.userName,
              name: info.name,
              phone: info.phone,
              address: info.address,
              discount: totalDiscount
            }
          })
          let detailMsg = true
          for(let i in cartList){
              let delMsg = await cartDetailAPI.deleteCartDetail({cartDetailID: cartList[i].cartDetailID})
              let creMsg = await billDetailAPI.createBillDetail({
                accessToken: newToken,
                data: {
                  billDetailID: id + '-' + cartList[i].productID,
                  billID: id,
                  productID: cartList[i].productID,
                  quantity: cartList[i].quantity,
                  price: cartList[i].price,
                  totalAmount: cartList[i].totalAmount,
                  discount: cartList[i].discount
                }
              })
              if(delMsg.err || creMsg.err){
                detailMsg = false
                break
              }
          }
          if(!msg.err && detailMsg){
            toast.success(`Thanh toán thành công!`, {
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
            await cartAPI.deleteCart({cartID: user.user.userName})
            dispatch(cartSlice.actions.setCartList([]))
            let list = await billAPI.getBillByUser({userName: user.user.userName, accessToken: newToken})
            if(!list.err){
                dispatch(purchaseHistorySlice.actions.setBillList(list))
                let local = []
                for(let i in list){
                    let detail = await (billDetailAPI.getBillDetail({billID: list[i].billID, accessToken: newToken}))
                    local[list[i].billID] = detail
                }
                dispatch(purchaseHistorySlice.actions.setBillDetailList(local))
            }
            setInfo({name: "", phone: "", address: ""})
          }
      } 
      else {
        toast.error(`Hãy đăng nhập để có thể thanh toán!`, {
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
    }
  }

  return (
    <form className="cart-right-container" onSubmit={handlePayment}>
      <div className="cart-right-info-section">
        <div className="cart-right-header">Chi tiết giao hàng</div>
        <div className="cart-right-info">
          <div className="info-title">
            <p> Tên: </p>
            <input
              className="cart-info-input"
              name="name"
              placeholder="Enter your name here..."
              onChange={handleInput}
              value={info.name}
              required
            />
          </div>
          <div className="info-title">
            <p> Số điện thoại: </p>
            <input
              className="cart-info-input"
              name="phone"
              placeholder="Enter your phone number here..."
              type="number" 
              onChange={handleInput}
              value={info.phone}
              required
            />
          </div>
          <div className="info-title">
            <p> Địa chỉ: </p>
            <textarea
              className="cart-info-input"
              name="address"
              placeholder="Enter your address  here..."
              resize="none"
              onChange={handleInput}
              value={info.address}
            />
          </div>
        </div>
      </div>

      <div className="cart-right-bill-section">
        <div className="cart-right-header"> Tổng cộng </div>
        <div className="bill-title">
          <p> Giá gốc: </p>
          <span className="bill-price-bf-disc"> {toMoney(cartInfo.listPrice)}đ </span>
        </div>
        <div className="bill-title">
          <p> Khuyến mãi: </p>
          <span className="bill-disc"> {toMoney(cartInfo.discount)}đ </span>
        </div>
        <div className="bill-title">
          <p> Thành tiền: </p>
          <span className="bill-price-af-disc"> {toMoney(cartInfo.netPrice)}đ </span>
        </div>
        <button className="bill-payment-btn" type='submit'> Thanh toán </button>
      </div>
    </form>
  );
};

export default CartRightSection
