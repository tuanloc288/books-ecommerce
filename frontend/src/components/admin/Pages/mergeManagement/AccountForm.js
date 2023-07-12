import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createAccount } from "../../../../reducers/apiReducer/accountAPI/createAccount";
import { getCurrentDate } from "../../others/utils";
import { refreshTokenHandler } from "../../../../reducers/apiReducer/signFormAPI/refreshToken";
import { toast } from "react-toastify";
import accountFormSlice from "../../../../reducers/componentsReducer/accountMgmt/accountMgmtSlice";
import accountListSlice from "../../../../reducers/apiReducer/accountAPI/getAllAccounts";
import { updateAccount } from "../../../../reducers/apiReducer/accountAPI/updateAccount";

const AccountForm = () => {
  const formData = useSelector((state) => state.accountMgmt.formData);
  const formType = useSelector((state) => state.accountMgmt.formType);
  const accountList = useSelector((state) => state.getAccounts.accountsList);
  const signInData = useSelector((state) => state.signIn.data);
  const [data, setData] = useState({
    user: Object.keys(formData).length !== 0 ? formData.userName : "",
    pass: "",
  });
  const privilegedList = useSelector(
    (state) => state.getPrivileged.privilegedList
  );
  const [priList, setPriList] = useState(
    Object.keys(formData).length !== 0 ? formData.privileged : {}
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (privilegedList.length !== 0 && Object.keys(priList).length === 0) {
      let temp = {};
      for (let i in privilegedList) {
        temp[privilegedList[i].privilegedID] = false;
      }
      setPriList(temp);
    }
  }, [privilegedList]);

  const handleConfirm = async () => {
    let check = true;
    if (!data.user.trim().includes("@gmail.com")) {
      check = "Tài khoản phải chứa @gmail.com";
    }
    if (data.pass.trim().length < 5) {
      if (typeof check === "boolean")
        check = "Mật khẩu phải dài hơn hoặc bằng 5 ký tự!";
    }
    if (typeof check !== "boolean") {
      toast.error(`${check}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        pauseOnFocusLoss: false,
        progress: undefined,
        theme: "dark",
      });
    } else {
      if (formType.includes("Thêm")) {
        let checkExisted = false;
        for (let i in accountList) {
          if (accountList[i].userName === data.user) {
            checkExisted = true;
            break;
          }
        }
        if (checkExisted) {
          toast.error(`Tài khoản đã tồn tại!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            pauseOnFocusLoss: false,
            progress: undefined,
            theme: "dark",
          });
        } else {
          let tickedList = [];
          for (let i in Object.keys(priList)) {
            if (priList[Object.keys(priList)[i]]) {
              tickedList.push(Object.keys(priList)[i]);
            }
          }
          let newToken = await refreshTokenHandler(
            signInData.accessToken,
            dispatch
          );
          createAccount({
            accessToken: newToken,
            data: {
              userName: data.user,
              password: data.pass,
              privileged: tickedList.length === 0 ? ["CTM"] : tickedList,
            },
          });
          dispatch(
            accountListSlice.actions.addAccount({
              userName: data.user,
              password: data.pass,
              isAvailable: true,
              isRemembered: false,
              privileged: tickedList.length === 0 ? ["CTM"] : tickedList,
              createdAt: getCurrentDate(),
              updatedAt: null,
              _destroy: false,
            })
          );
          toast.success(`Thêm tài khoản thành công`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            pauseOnFocusLoss: false,
            progress: undefined,
            theme: "dark",
          });
          dispatch(
            accountFormSlice.actions.setForm({
              type: "",
              data: {},
              show: false,
            })
          );
        }
      } else {
        if (
          data.user === "booksecommerce2022@gmail.com" &&
          signInData.user.userName !== "booksecommerce2022@gmail.com"
        ) {
          toast.error("Bạn không có quyền chỉnh sửa tài khoản admin chính!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            pauseOnFocusLoss: false,
            progress: undefined,
            theme: "dark",
          });
        } else {
          let tickedList = [];
          for (let i in Object.keys(priList)) {
            if (priList[Object.keys(priList)[i]]) {
              tickedList.push(Object.keys(priList)[i]);
            }
          }
          dispatch(
            updateAccount({
              userName: data.user,
              data: {
                password: data.pass,
                privileged: tickedList.length === 0 ? ["CTM"] : tickedList,
              },
            })
          );
          let account = accountList.filter(
            (item) => item.userName === data.user
          )[0];
          let updatedAccount = {
            ...account,
            privileged: tickedList.length === 0 ? ["CTM"] : tickedList,
          };
          dispatch(accountListSlice.actions.updateAccount(updatedAccount));
          toast.success(`Cập nhật tài khoản thành công`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            pauseOnFocusLoss: false,
            progress: undefined,
            theme: "dark",
          });
          dispatch(
            accountFormSlice.actions.setForm({
              type: "",
              data: {},
              show: false,
            })
          );
        }
      }
    }
  };

  const handleCheckBox = (id) => {
    if (id === "CTM") {
      if (!priList["CTM"]) {
        let temp = {};
        for (let i in privilegedList) {
          temp[privilegedList[i].privilegedID] = false;
        }
        setPriList(() => ({
          ...temp,
          [id]: true,
        }));
      } else {
        setPriList(() => ({
          ...priList,
          [id]: false,
        }));
      }
    } else if (id === "ADM") {
      if (priList["ADM"]) {
        let temp = {};
        for (let i in privilegedList) {
          temp[privilegedList[i].privilegedID] = false;
        }
        setPriList(temp);
      } else {
        setPriList(() => ({
          ...priList,
          [id]: true,
          ["CTM"]: false,
        }));
      }
    } else {
      let temp = { ...priList, CTM: false, ADM: true };
      let handleType = id.split("-");
      if (handleType.length === 2) {
        if (handleType[1] !== "S") {
          if (
            !accountList
              .filter((item) => item.userName === signInData.user.userName)[0]
              .privileged.includes("ADM-U") &&
            signInData.user.userName !== "booksecommerce2022@gmail.com"
          ) {
            toast.error(
              "Chỉ admin chính mới có thể phân quyền bậc cao cho các tài khoản!",
              {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                pauseOnFocusLoss: false,
                progress: undefined,
                theme: "dark",
              }
            );
          } else {
            if (handleType[1] !== "R") {
              if (!temp["ADM-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-R"]: true,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            } else if (handleType[1] === "R") {
              if (temp["ADM-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-C"]: false,
                  ["ADM-U"]: false,
                  ["ADM-D"]: false,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            }
          }
        } else {
          setPriList(() => ({
            ...temp,
            [id]: !temp[id],
            ["ADM-P-R"]: temp[id] ? false : true,
            ["ADM-C-R"]: temp[id] ? false : true,
            ["ADM-B-R"]: temp[id] ? false : true,
            ["ADM-W-R"]: temp[id] ? false : true,
            ["ADM-D-R"]: temp[id] ? false : true,
          }));
        }
      } else if (handleType.length === 3) {
        switch (handleType[1]) {
          case "P": {
            if (handleType[2] !== "R") {
              if (!temp["ADM-P-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-P-R"]: true,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            } else if (handleType[2] === "R") {
              if (temp["ADM-P-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-P-C"]: false,
                  ["ADM-P-U"]: false,
                  ["ADM-P-D"]: false,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            }
            break;
          }
          case "C": {
            if (handleType[2] !== "R") {
              if (!temp["ADM-C-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-C-R"]: true,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            } else if (handleType[2] === "R") {
              if (temp["ADM-C-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-C-C"]: false,
                  ["ADM-C-U"]: false,
                  ["ADM-C-D"]: false,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            }
            break;
          }
          case "A": {
            if (handleType[2] !== "R") {
              if (!temp["ADM-A-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-A-R"]: true,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            } else if (handleType[2] === "R") {
              if (temp["ADM-A-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-A-C"]: false,
                  ["ADM-A-U"]: false,
                  ["ADM-A-D"]: false,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            }
            break;
          }
          case "B": {
            if (handleType[2] !== "R") {
              if (!temp["ADM-B-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-B-R"]: true,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            } else if (handleType[2] === "R") {
              if (temp["ADM-B-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-B-UD"]: false,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            }
            break;
          }
          case "PR": {
            if (handleType[2] !== "R") {
              if (!temp["ADM-PR-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-PR-R"]: true,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            } else if (handleType[2] === "R") {
              if (temp["ADM-PR-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-PR-C"]: false,
                  ["ADM-PR-U"]: false,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            }
            break;
          }
          case "W": {
            if (handleType[2] !== "R") {
              if (!temp["ADM-W-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-W-R"]: true,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            } else if (handleType[2] === "R") {
              if (temp["ADM-W-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-W-CUD"]: false,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            }
            break;
          }
          case "D": {
            if (handleType[2] !== "R") {
              if (!temp["ADM-D-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-D-R"]: true,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            } else if (handleType[2] === "R") {
              if (temp["ADM-D-R"]) {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                  ["ADM-D-C"]: false,
                  ["ADM-D-U"]: false,
                  ["ADM-D-D"]: false,
                }));
              } else {
                setPriList(() => ({
                  ...temp,
                  [id]: !temp[id],
                }));
              }
            }
            break;
          }
        }
      }
    }
  };

  return (
    <div className="panel-container">
      <div className="panel-form-form">
        <div className="panel-title"> Quản lý tài khoản: {formType} </div>
        {/* <div className="panel-form-title">{formType}</div> */}
        <div id="account-form-container">
          <div id="account-form-left">
            <div className="account-form-label"> Tên tài khoản </div>
            {formType.includes("Thêm") ? (
              <input
                className="account-form-input"
                autoComplete="off"
                value={data.user}
                name="user"
                onChange={(e) => {
                  setData(() => ({
                    ...data,
                    [e.target.name]: e.target.value,
                  }));
                }}
              />
            ) : (
              <input defaultValue={formData.userName} disabled />
            )}
            <div className="account-form-label"> Mật khẩu </div>
            <input
              className="account-form-input"
              type="password"
              name="pass"
              autoComplete="off"
              value={data.pass}
              onChange={(e) => {
                setData(() => ({
                  ...data,
                  [e.target.name]: e.target.value,
                }));
              }}
            />
            <div id="account-form-btn-section">
              <button
                type="button"
                className="btn btn-green"
                onClick={handleConfirm}
              >
                {formType.includes("Thêm") ? "Thêm" : "Chỉnh sửa"}
              </button>
              <button
                className="btn btn-red"
                onClick={() => {
                  dispatch(
                    accountFormSlice.actions.setForm({
                      type: "",
                      data: {},
                      show: false,
                    })
                  );
                }}
              >
                Trở về
              </button>
            </div>
          </div>
          <div id="account-form-right">
            {privilegedList.map((item) => {
              return (
                <div
                  key={item.privilegedID}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    name={item.privilegedID}
                    value={item.privilegedID}
                    checked={priList[item.privilegedID]}
                    className="accountMgmt-pri-section-checkbox"
                    onChange={(e) => {
                      handleCheckBox(e.target.value);
                    }}
                  ></input>
                  <label htmlFor={item.privilegedID}>
                    {" "}
                    {item.privilegedID}{" "}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountForm;
