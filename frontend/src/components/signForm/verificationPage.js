import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { sendMail } from "../../reducers/apiReducer/signFormAPI/sendMail";
import ChangePassword from './changePassword'
import signFormSlice from '../../reducers/componentsReducer/signForm/signFormSlice'
import VerificationCode from './verificationCode';
import './verificationPage.css'

const VerificationPage = () => {
    const [sendEmailAddress, setSendEmailAddress] = useState(true)
    const isForgotPassword = useSelector(state => state.signForm.isForgotPassword)
    const isVerification = useSelector(state => state.signForm.isVerification)
    const sendMailLoading = useSelector(state => state.sendMail.isLoading)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleEmailAddress = async (e) => {
        e.preventDefault()
        let value = document.querySelectorAll('.verification-page-input')[0].value.trim()
        if(value !== '' && value != null && (value.includes('@gmail.com') || value.includes('@yahoo.com'))){
            await dispatch(sendMail({email: value}))
            dispatch(signFormSlice.actions.setFormData({email: value}))
            setSendEmailAddress(false)
        }
        else {
            alert('Wrong email pattern')
            document.querySelectorAll('.verification-page-input')[0].focus()
        }
    }

    return (
        <div id='verification-page-container'>
            <div id='verification-page-content'>
                {
                    !isVerification ? ( isForgotPassword && sendEmailAddress ? (
                        <>
                            {
                                sendMailLoading ? (<div className='loader'></div>) : (
                                    <>
                                        <div id='verification-page-logo-section'>
                                            <div id="verification-page-logo"></div>
                                            <p id="verification-page-logo-name"> BOOKIVERSE </p>
                                        </div>
                                        <div id='verification-page-header'>
                                            Nhập email (tài khoản) của bạn ở dưới đây
                                        </div>
                                        <form onSubmit={handleEmailAddress}>
                                            <input type='email' className='verification-page-input' placeholder='Nhập email' name='emailAddress' required autoComplete='off'></input>
                                            <div id='verification-page-btn-section'>
                                                <button id='verification-page-cancel' className='verification-page-btn' onClick={() => {
                                                        return navigate('/signForm')
                                                    }}> Trở về </button>
                                                <button id='verification-page-verify' className='verification-page-btn' type='submit'> Tiếp tục </button>
                                            </div>
                                        </form>
                                    </>
                                )   
                            }
                        </>
                    ) : <VerificationCode/>) : (
                        <ChangePassword/>
                    )
                }
            </div>
        </div>
    )
}

export default VerificationPage