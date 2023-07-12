import { useState } from "react";
import signFormSlice from "../../reducers/componentsReducer/signForm/signFormSlice";
import "./signForm.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { sendMail } from "../../reducers/apiReducer/signFormAPI/sendMail";
import { getOneAccount } from "../../reducers/apiReducer/accountAPI/getOneAccount";
import { ToastContainer, toast } from "react-toastify";

const SignUp = () => {
  const isLoading = useSelector(state => state.sendMail.isLoading)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handelInput = (e) => {
    setUser(() => ({
      ...user,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let email = e.target.email.value
    let password = e.target.password.value;
    let repeatPassword = e.target.repeatPassword.value;
    const res = await getOneAccount({userName: email})
    if(res.err) {
      if (password === repeatPassword) {
        dispatch(signFormSlice.actions.verifyEmail(true))
        dispatch(signFormSlice.actions.forgotPassword(false))
        await dispatch(sendMail({email}))
        dispatch(signFormSlice.actions.setFormData({email, password}))
        return navigate('/verification')
      } else {
        toast.warning(`Mật khẩu và nhập lại mật khẩu không khớp!` , {
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
        let ele = document.getElementById("repeat-password");
        ele.value = "";
        ele.focus();
      }
    }
    else {
      toast.warning(`Tài khoản đã tồn tại!` , {
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
      let input = document.querySelectorAll('.sign-input')
      input[0].value = '' 
      input[0].focus() 
    }
  };

  const handleSwitchForm = () => {
    dispatch(signFormSlice.actions.switchForm(false));
  };

  return (
    <>
      {
        isLoading ? <div className="loader"></div> 
        : (
          <form className="signForm" onSubmit={handleSubmit}>
            <div className="signForm-logo-section">
              <div className="signForm-logo"></div>
              <p className="signForm-logo-name"> BOOKIVERSE </p>
            </div>
            <div className="sign-header"> Đăng ký </div>

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
                autoComplete="off"
                onChange={handelInput}
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
                minLength='3'
                onChange={handelInput}
              />
            </div>

            <div className="sign-section">
              <label htmlFor="repeatPassword" className="sign-title">
                Nhập lại mật khẩu
              </label>
              <input
                id="repeat-password"
                name="repeatPassword"
                type="password"
                required
                className="sign-input"
                placeholder="Nhập lại mật khẩu"
                minLength='3'
                onChange={handelInput}
              />
            </div>

            <div className="sign-switch" onClick={handleSwitchForm}>
              Đã có tài khoản? Đăng nhập ngay!
            </div>
            <div className="signIn-btn-section">
              <Link to='/' className="sign-btn sign-back-to-home">
                Trở về trang chủ
              </Link>
              <button type="submit" className="sign-btn  sign-main-btn">
                Đăng ký
              </button>
            </div>
          </form>
        )
      }
      <ToastContainer/>
    </>
  );
};

export default SignUp;
