import './cart.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import CartItem from './CartItem'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import CartRightSection from './CartRightSection'


const Cart = () => {
    const cartList = useSelector(state => state.carts.cartList)

    useEffect(() => {
    }, [cartList])

    return (
        <div className='cart-container'>

            <div className='cart-left-container'>
                <div className='cart-left-header'>
                    Giỏ hàng của bạn
                </div>

                <div className='cart-content'>

                    {
                        cartList.length !== 0 ? (
                            cartList.map((item) => {
                                return (
                                    <CartItem 
                                        key={item.cartDetailID ? item.cartDetailID : item.productID}
                                        cartDetailID={item.cartDetailID}
                                        bookID={item.productID}
                                        quantity={item.quantity}
                                        totalAmount={item.totalAmount}
                                    />     
                                )                                       
                            })
                        ) : <div id='empty-cart'> Chưa có sản phẩm nào </div>
                    }

                </div>

            </div>

            <CartRightSection/>
        <ToastContainer/>
        </div>
    )
}

export default Cart