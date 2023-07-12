import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { updateAccount } from "../../reducers/apiReducer/accountAPI/updateAccount";
import signFormSlice from "../../reducers/componentsReducer/signForm/signFormSlice";
import "./verificationPage.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector((state) => state.signForm.formData);
  const updateAccountData = useSelector((state) => state.updateAccount.data);
  const [isLoading, setIsLoading] = useState(false);
  const vMsg = useSelector((state) => state.signForm.verificationMessage);
  const [input, setInput] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChangePassword = async () => {
    let data = document.querySelectorAll(".verification-page-input");
    let password = data[0].value.trim();
    let confirmPassword = data[1].value.trim();

    if (password === confirmPassword) {
      await dispatch(
        updateAccount({ userName: formData?.email, data: { password } })
      );
    } else {
      toast.error("Mật khẩu và nhập lại mật khẩu không khớp!", {
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
      data[1].value = "";
      data[1].focus();
    }
  };

  const handleInput = () => {
    let data = document.querySelectorAll(".verification-page-input");
    data.forEach((ele) => {
      ele.value = "";
    });
  };

  useEffect(() => {
    return () => {
      dispatch(signFormSlice.actions.setVerificationMsg({}));
      dispatch(signFormSlice.actions.forgotPassword(false));
      dispatch(signFormSlice.actions.verifyClick(false));
    };
  }, []);

  useEffect(() => {
    if (Object.keys(updateAccountData).length !== 0) {
      dispatch(signFormSlice.actions.setVerificationMsg(updateAccountData));
    }
  }, [updateAccountData]);

  useEffect(() => {
    if (
      Object.keys(vMsg).length !== 0 &&
      input.password !== null &&
      input.password !== ""
    )
      handleChangePasswordMsg();
  }, [vMsg]);

  const handleChangePasswordMsg = () => {
    if (vMsg.message) {
      toast.success('Đổi mật khẩu thành công!', {
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
      setIsLoading(true);
      dispatch(signFormSlice.actions.switchForm(false));
      setTimeout(() => {
        return navigate("/signForm");
      }, 2500);
    } else if (vMsg.err) {
      toast.error(vMsg.err, {
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
      setIsLoading(true);
      setTimeout(() => {
        return navigate("/signForm");
      }, 2500);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <>
          <div id="verification-page-logo-section">
            <div id="verification-page-logo"></div>
            <p id="verification-page-logo-name"> BOOKIVERSE </p>
          </div>
          <div id="verification-page-header"> Đổi mật khẩu </div>
          <input
            className="verification-page-input"
            type="password"
            placeholder="Mật khẩu mới"
            name="newPassword"
            minLength="8"
            onChange={(e) =>
              setInput({
                ...input,
                password: e.target.value,
              })
            }
            required
          ></input>
          <input
            className="verification-page-input"
            type="password"
            placeholder="Nhập lại mật khẩu"
            name="confirmPassword"
            minLength="8"
            onChange={(e) =>
              setInput({
                ...input,
                confirmPassword: e.target.value,
              })
            }
            required
          ></input>
          <div>
            <button
              id="verification-page-cancel"
              className="verification-page-btn"
              onClick={() => {
                handleInput();
                dispatch(signFormSlice.actions.verifyClick(false));
              }}
            >
              Trở về
            </button>
            <button
              id="verification-page-verify"
              className="verification-page-btn"
              onClick={handleChangePassword}
            >
              Xác nhận
            </button>
          </div>
        </>
      )}
      <ToastContainer/>
    </>
  );
};

export default ChangePassword;
