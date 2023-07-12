import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { sendMail } from "../../reducers/apiReducer/signFormAPI/sendMail";
import { signUp } from "../../reducers/apiReducer/signFormAPI/signUp";
import signFormSlice from '../../reducers/componentsReducer/signForm/signFormSlice'
import './verificationPage.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerificationCode = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isVerifyEmail = useSelector(state => state.signForm.isVerifyEmail)
    const formData = useSelector(state => state.signForm.formData)
    let sendMailData = useSelector(state => state.sendMail.data)
    let signUpData = useSelector(state => state.signUp.data)
    const isForgotPassword = useSelector(state => state.signForm.isForgotPassword)
    let vMsg = useSelector(state => state.signForm.verificationMessage)
    const [codeInput , setCodeInput] = useState('')
    const [count, setCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const toastError = (msg) => {
        toast.error(msg, {
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

    const handleVerify = async () => {
        let value = document.querySelectorAll('.verification-page-input')[0].value.trim()
        let code = sendMailData.data.code
        let expiredIn = new Date(sendMailData.data.expiredIn)
        if(isForgotPassword && Object.keys(sendMailData).length !== 0 && value === code){
            if(expiredIn < new Date()){
                toastError('Mã xác thực đã hết hạn!')
            }
            else dispatch(signFormSlice.actions.verifyClick(true))
        }
        else if(isVerifyEmail  && Object.keys(sendMailData).length !== 0 && value === code){
            if(expiredIn < new Date()){
                toastError('Mã xác thực đã hết hạn!')
            }
            else {
                await dispatch(signUp({userName: formData.email , password: formData.password}))
            }
        }
        else {
            toastError('Mã xác thực không đúng!')
            setCodeInput('')
            document.querySelector('.verification-page-input').focus()
        }
    }

    const handleSendAgain = async () => {
        if(count !== 0){
            toastError(`Hãy thử lại sau ${count}s!`)
        }
        else {
            dispatch(sendMail({email: formData?.email}))
            setCount(60)
        }
    }

    useEffect(() => {
        if(count !== 0){
            setTimeout(() => {
                setCount(count - 1)
            }, 1000)
        }
    }, [count])

    useEffect(() => {
        if(!sendMailData.data?.code){
            toastError(`Không tìm thấy mã xác thực!`)
            setIsLoading(true)
            setTimeout(() => {
                return navigate('/signForm')
            }, 2500)
        }
        return () => {
            dispatch(signFormSlice.actions.setVerificationMsg({}))
        }
    }, [])

    useEffect(() => {
        if(Object.keys(signUpData).length !== 0){
            dispatch(signFormSlice.actions.setVerificationMsg(signUpData))
        }
    }, [signUpData])

    useEffect(() => {
        if(Object.keys(vMsg).length !== 0 && Object.keys(sendMailData).length !== 0 && codeInput === sendMailData.data.code)
            handleSignUpMessage()    
    },[vMsg])

    const handleSignUpMessage = () => {
        if(vMsg.message) {
            toast.success('Tạo tài khoản thành công!', {
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
            setIsLoading(true)
            dispatch(signFormSlice.actions.switchForm(false))
            setTimeout(() => {
                return navigate('/signForm')
            }, 2500)
        }
        else if(vMsg.err){
            toastError(vMsg.err)
            setIsLoading(true)
            setTimeout(() => {
                return navigate('/signForm')
            }, 2500)
        }
    }

    return (
        <>
            {
                isLoading ? (<div className='loader'></div>) : (
                    <>
                        <div id="verification-page-logo-section">
                            <div id="verification-page-logo"></div>
                            <p id="verification-page-logo-name"> BOOKIVERSE </p>
                        </div>
                        <div id="verification-page-header">
                            Đã gửi mã xác thực! Hãy kiểm tra mail của bạn
                        </div>
                        <input
                            className="verification-page-input"
                            placeholder="Nhập mã xác thực vào đây..."
                            name="verificationCode"
                            autoComplete='off'
                            onChange={(e) => setCodeInput(e.target.value)}
                            value={codeInput}
                        ></input>
                        <div>
                            <button
                            id="verification-page-cancel"
                            className="verification-page-btn"
                            onClick={() => {
                                return navigate("/signForm");
                            }}
                            >
                            Trở lại
                            </button>
                            <button
                            id="verification-page-resend"
                            className="verification-page-btn"
                            onClick={handleSendAgain}
                            >
                            Gửi lại mã {count === 0 ? null : count + "s"}
                            </button>
                            <button
                            id="verification-page-verify"
                            className="verification-page-btn"
                            onClick={handleVerify}
                            >
                            Xác thực
                            </button>
                        </div>
                    </>
                )
            }
            <ToastContainer/>
        </>
    );
};

export default VerificationCode;
