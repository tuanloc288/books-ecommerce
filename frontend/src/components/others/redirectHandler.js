import { Navigate } from "react-router-dom"
import jwt_decode from 'jwt-decode'

const RedirectHandler = (props) => {
    const token = document.cookie.split('refreshToken=')[1]

    const checkLogin = () => {
        if(!token){
            localStorage.setItem('RedirectMessage' , `Hãy đăng nhập trước để truy cập!`)
            return <Navigate to='/signForm'/>
        }
        else return props.children
    }
    
    const checkAdmin = () => {
        if(typeof token !== 'undefined'){
            const decodedToken = jwt_decode(token)
            if(!decodedToken.isAdmin){
                localStorage.setItem('RedirectMessage' , `Bạn không có quyền truy cập!`)
                return <Navigate to='/'/>
            }
            else return props.children
        }
        else {
            localStorage.setItem('RedirectMessage' , `Hãy đăng nhập trước để truy cập!`)
            return <Navigate to='/signForm'/>
        }
    }

    return (
        <>
            {
                props.login ? checkLogin() : checkAdmin()
            }
        </>
    )
}

export default RedirectHandler