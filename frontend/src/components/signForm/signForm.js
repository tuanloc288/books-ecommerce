import './signForm.css'
import SignIn from './signIn'
import SignUp from './signUp'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const SignForm = () => {
    const isSignUp = useSelector(state => state.signForm.isSignUp)
    const signInData = useSelector((state) => state.signIn.data);

    useEffect(() => {
        if (signInData.err) {
          toast.warning(`${signInData.err}` , {
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
        } else if (signInData.user) {
            toast.success(`${signInData.message}`, {
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
      }}, [signInData]);

      useEffect(() => {
        let msg = localStorage.getItem('RedirectMessage')
        if(msg){
            toast.error(msg , {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                pauseOnFocusLoss: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            localStorage.removeItem('RedirectMessage')
        }
      }, [])
    
    return (
        <div className='sign-container'>
            {
                !isSignUp ? <SignIn/> : <SignUp/>
            }
            <img src="../../images/signFormBg.jpg" id="signFormBg" alt='signFormBg'/>
            <ToastContainer/>
        </div>   
    )
}

export default SignForm