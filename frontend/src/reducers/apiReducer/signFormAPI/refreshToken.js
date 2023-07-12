import jwt_decode from 'jwt-decode'
import axiosInstance from "../../../components/others/axiosInstance";
import signIn from "./signIn"

export const refreshTokenHandler = async (token, dispatch) => {
  try {
    let date = new Date();
    const decodedToken = jwt_decode(token);
    if (decodedToken.exp <= (date.getTime() / 1000)) {
      const res = await axiosInstance.post("signForm/refreshToken",{
        withCredentials: true
      })
      dispatch(signIn.actions.updateToken(res.data.accessToken));
      if(decodedToken.isRemembered){
        localStorage.setItem('refreshToken', document.cookie.split('refreshToken=')[1])
      }
      return res.data.accessToken
    }
    else return token
  } catch (error) {
    return error;
  }
};

