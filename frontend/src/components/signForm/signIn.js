import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import "./signForm.css";
import signFormSlice from "../../reducers/componentsReducer/signForm/signFormSlice";
import { signIn } from "../../reducers/apiReducer/signFormAPI/signIn";
import signInSlice from "../../reducers/apiReducer/signFormAPI/signIn";
import { checkRemembered } from "./checkRemembered";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signInData = useSelector((state) => state.signIn.data);


  const [user, setUser] = useState(checkRemembered());

  const handelInput = (e) => {
    setUser(() => ({
      ...user,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(signIn({ userName: user.email, password: user.password, isRemembered: user.isRemembered }));
  };

  useEffect(() => {
    if(signInData.err){
      signInData.err.includes('password') ? document.getElementById('password').focus() : document.getElementById('email-address').focus()
      dispatch(signInSlice.actions.signOut())
    }
    if (signInData.user) {
      if(!user.isRemembered && localStorage.getItem('refreshToken')){
        const check = checkRemembered() 
        if(check.email !== '' && check.email === user.email){
          localStorage.removeItem('refreshToken')
        }
      }
      else if(user.isRemembered){
        localStorage.setItem('refreshToken', document.cookie.split('refreshToken=')[1])
      } 
      setTimeout(() => {
        if(signInData.isAdmin)
          return navigate("/management");
        else return navigate("/");
      }, 2500)
    }
  }, [signInData]);

  const handleSwitchForm = () => {
    dispatch(signFormSlice.actions.switchForm(true));
  };

  const handleForgotPassword = () => {
    dispatch(signFormSlice.actions.forgotPassword(true));
    dispatch(signFormSlice.actions.verifyEmail(false));
    return navigate("/verification");
  };

  return (
    <>
      {signInData.user ? (
        <div className="loader"></div>
      ) : (
        <form className="signForm" onSubmit={handleSubmit}>
          
          <div className="signForm-logo-section">
            <div className="signForm-logo"></div>
            <p className="signForm-logo-name"> BOOKIVERSE </p>
          </div>
          <div className="sign-header"> Đăng nhập </div>

          <div className="sign-section">
            <label htmlFor="email-address" className="sign-title">
              Email
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              className="sign-input"
              placeholder="Nhập email"
              autoComplete="on"
              onChange={handelInput}
              value={user.email}
            />
          </div>

          <div className="sign-section">
            <label htmlFor="password" className="sign-title">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="sign-input"
              placeholder="Nhập mật khẩu"
              autoComplete="off"
              onChange={handelInput}
              value={user.password}
            />
          </div>
          <div id="sign-bottom-section">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <input
                id="remembered"
                name="remembered"
                type="checkbox"
                className="signIn-remembered"
                checked={user.isRemembered}
                onChange={() => {
                  setUser(() => ({
                    ...user,
                    isRemembered: !user.isRemembered,
                  }));
                }}
              />
              <label
                htmlFor="remembered"
                className="sign-title"
                id="signIn-remembered"  
              >
                Nhớ tài khoản
              </label>
            </div>
            <div id="signIn-forgot" onClick={handleForgotPassword}>
              Quên mật khẩu?
            </div>
          </div>
          <div className="sign-switch" onClick={handleSwitchForm}>
            Chưa có tài khoản? Đăng ký ngay!
          </div>
          <div className="signIn-btn-section">
            <Link to='/' className="sign-btn sign-back-to-home">
              Trở về trang chủ
            </Link>
            <button className="sign-btn  sign-main-btn" type="submit">
              Đăng nhập
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default SignIn;
