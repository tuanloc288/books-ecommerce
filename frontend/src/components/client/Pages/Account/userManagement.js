import './userManagement.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendMail } from '../../../../reducers/apiReducer/signFormAPI/sendMail'
import { toast } from 'react-toastify'
import { updateAccount } from "../../../../reducers/apiReducer/accountAPI/updateAccount";
import { signOut } from '../../../../reducers/apiReducer/signFormAPI/signOut'
import purchaseHistorySlice from '../../../../reducers/componentsReducer/purchaseHistory/purchaseHistorySlice'
import { useNavigate } from 'react-router-dom'
import cartSlice from '../../../../reducers/componentsReducer/carts/cartSlice'
import sendMailSlice from '../../../../reducers/apiReducer/signFormAPI/sendMail'


const AccountManagementModal = (props) => {

    const sendMailData = useSelector(state => state.sendMail.data)
    const [isLoading, setIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [verify, setVerify] = useState({
        isVerify: false,
        code: ''
    })
    const [password, setPassword] = useState({
        newPass: '',
        confirmPass: ''
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const ele = document.getElementById('account-management-modal-wrapper') 
        ele.addEventListener('mouseup' , handleClickOutside)
        return () => {
            setIsLoading(false)
            ele.removeEventListener('mouseup', handleClickOutside)
        }
    }, [])
    
    const handleClickOutside = () => {
        const ele = document.getElementById('account-management-modal-wrapper') 
        let container = document.getElementById('account-management-modal-container')
        ele.addEventListener('mouseup' , (e) => {
            if(!container.contains(e.target)){
                ele.classList.remove('showModal')
                container.classList.remove('showModal')
                document.body.classList.remove('modal-open')
                setIsEditing(false)
                setVerify({
                    isVerify: false,
                    code: ''
                })
                setPassword({
                    newPass: '',
                    confirmPass: ''
                })
            }
        } , {once: true})
    }
    
    const handleCloseDetail= () => {
        document.getElementById('account-management-modal-wrapper').classList.remove('showModal')
        document.getElementById('account-management-modal-container').classList.remove('showModal')
        document.body.classList.remove('modal-open')
        setIsEditing(false)
        setVerify({
            isVerify: false,
            code: ''
        })
        setPassword({
            newPass: '',
            confirmPass: ''
        })
    }

    const handleChangePasswordClick = async () => {
        setVerify({
            ...verify,
            isVerify: true
        })
        dispatch(sendMailSlice.actions.clearMailData())
        await dispatch(sendMail({email: props.username}))
    }

    const handleChangePassword = async () => {
        let pass = password.newPass.trim()
        let confirmPass = password.confirmPass.trim()
        if(pass === confirmPass){
            toast.success('Đổi mật khẩu thành công! Mời bạn đăng nhập lại.', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                pauseOnFocusLoss: false,
                draggable: true,
                progress: undefined,
                theme: "dark",   
            })
            await dispatch(updateAccount({ userName: props.username, data: { password: password.newPass } }));
            setIsLoading(true)
            document.querySelectorAll('.account-management-modal-input')[1].disabled = true
            document.querySelectorAll('.account-management-modal-input')[2].disabled = true
            setTimeout(async () => {
                handleChangePasswordSuccess()
            }, 2000)
        }
        else {
            toast.error('Mật khẩu và nhập lại mật khẩu không khớp!', {
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
            document.querySelectorAll('.account-management-modal-input')[2].focus()
        }
    }
 
    const handleChangePasswordSuccess = async () => {
        await signOut(dispatch)
        dispatch(cartSlice.actions.setCartList([]))
        dispatch(purchaseHistorySlice.actions.setBillID(''))
        dispatch(purchaseHistorySlice.actions.setBillList([]))
        dispatch(purchaseHistorySlice.actions.setBillDetailList([]))
        const ele = document.getElementById('account-management-modal-wrapper') 
        let container = document.getElementById('account-management-modal-container')
        ele.classList.remove('showModal')
        container.classList.remove('showModal')
        document.body.classList.remove('modal-open')
        setIsEditing(false)
        setVerify({
            isVerify: false,
            code: ''
        })
        setPassword({
            newPass: '',
            confirmPass: ''
        })
        setIsLoading(false)
        return navigate('/signForm')
    }

    const handleVerify = async () => {
        let value = verify.code.trim()
        let code = sendMailData.data?.code
        let expiredIn = new Date(sendMailData.data?.expiredIn)
        if(Object.keys(sendMailData).length !== 0 && value === code){
            if(expiredIn < new Date()){
                toast.error('Mã xác thực đã hết hạn',{
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
                setVerify({
                    isVerify: false,
                    code: ''
                })
            }
            else {
                setIsEditing(true)
            }
        }
        else {
            toast.error('Mã xác thực không đúng!', {
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
            document.querySelectorAll('.account-management-modal-input')[1].focus()
        }
    }

    return (
        <>
            {
                isLoading ? (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        
                    }}>
                        <div className='loader' style={{
                            width: '100%',
                            height: 350,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}> </div>
                    </div>
                ) : (
                    <>
                        <div id='account-management-modal-header'>
                            <div>
                                Quản lý tài khoản
                            </div>
                            <i className='fas fa-times' id='account-management-modal-close' onClick={handleCloseDetail}></i>
                        </div>
                        <div id="account-management-modal-content">
            
                            <div className="account-management-modal-title">
                                <div> Tên đăng nhập: </div>
                                <input className="account-management-modal-input" disabled
                                    defaultValue={props.username}
                                />
                            </div>
                            {
                                verify.isVerify && !isEditing ? (
                                    <div className="account-management-modal-title" style={{
                                        animation: 'fromBottom .5s ease-in-out 1'
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            textAlign: 'center'
                                        }}> Hãy kiểm tra email của bạn </div>
                                        <input className="account-management-modal-input" style={{
                                            textAlign: 'center'
                                        }} placeholder='Nhập code xác thực ở đây' onChange={(e) => {
                                            setVerify({
                                                ...verify,
                                                code: e.target.value
                                            })
                                        }} value={verify.code} 
                                        /> 
                                    </div>
                                ) : null
                            }
                            {isEditing && (
                            <>
                                    <div className="account-management-modal-title" style={{
                                        animation: 'fromRight .5s ease-in-out 1'
                                    }}>
                                        <div> Mật khẩu mới: </div>
                                        <input className="account-management-modal-input" type='password' name='newPass' 
                                            onChange={(e) => {
                                                setPassword(({
                                                    ...password,
                                                    newPass: e.target.value
                                                }))
                                        }}
                                            value={password.newPass}
                                        /> 
                                    </div>
                                    <div className="account-management-modal-title" style={{
                                        animation: 'fromRight .5s ease-in-out 1'
                                    }}>
                                        <div> Nhập lại mật khẩu: </div>
                                        <input className="account-management-modal-input" type='password' name='confirmPass' 
                                            onChange={(e) => {
                                                setPassword(({
                                                    ...password,
                                                    confirmPass: e.target.value
                                                }))
                                            }}
                                            value={password.confirmPass}
                                        />
                                    </div>
                            </>
                            )}
            
                            
                        </div>
                        <div id="account-management-modal-btn-section">
                            {
                                !verify.isVerify ? (
                                    <button className="account-management-modal-update-btn" onClick={() => 
                                        handleChangePasswordClick()
                                    }    
                                    > Đổi mật khẩu </button>
                                ) : (isEditing ? (
                                    <>
                                        <button className="account-management-modal-update-btn" onClick={() => {
                                            setIsEditing(false)
                                            setVerify({
                                                isVerify: false,
                                                code: ''
                                            })
                                            setPassword({
                                                newPass: '',
                                                confirmPass: ''
                                            })
                                        }}> Hủy </button>
                                        <button className="account-management-modal-update-btn" onClick={() => {
                                            handleChangePassword()
                                        }}> Lưu </button>
                                    </>
                                ) : 
                                    <>
                                        <button className="account-management-modal-update-btn" onClick={() => {
                                            setIsEditing(false)
                                            setVerify({
                                                isVerify: false,
                                                code: ''
                                            })
                                        }}> Trở lại </button>
                                        <button className="account-management-modal-update-btn" onClick={() => {
                                            handleVerify()
                                        }}> Xác thực </button>
                                    </>
                                )
                            }
                        </div>
                    </>
                )
            }
        </>
    )
}

export default AccountManagementModal