import jwt_decode from "jwt-decode"

export const checkRemembered = () => {
    let token = localStorage.getItem('refreshToken')
    if(token !== null){
        let decodedToken = jwt_decode(token)
        if(decodedToken.isRemembered){
            return {email: decodedToken.userName, password: decodedToken.password, isRemembered: true}
        }
        else return {email: '', password: '', isRemembered: false} 
    }
    else return {email: '', password: '', isRemembered: false} 
} 