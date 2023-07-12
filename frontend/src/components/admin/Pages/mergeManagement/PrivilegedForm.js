import "./privilgedManagement.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentDate } from "../../others/utils";
import { refreshTokenHandler } from "../../../../reducers/apiReducer/signFormAPI/refreshToken";
import { toast } from "react-toastify";
import { createPrivileged } from "../../../../reducers/apiReducer/privilegedAPI/createPrivileged";
import { updatePrivileged } from "../../../../reducers/apiReducer/privilegedAPI/updatePrivileged";
import privilegedListSlice from "../../../../reducers/apiReducer/privilegedAPI/getAllPrivileged";
import privilegedFormSlice from "../../../../reducers/componentsReducer/privilegedMgmt/privilegedMgmtSlice";

const PrivilegedForm = () => {
  const formData = useSelector((state) => state.privilegedMgmt.formData);
  const formType = useSelector((state) => state.privilegedMgmt.formType);
  const privilegedList = useSelector(
    (state) => state.getPrivileged.privilegedList
  );
  const signInData = useSelector((state) => state.signIn.data);
  const [data, setData] = useState({
    id: Object.keys(formData).length !== 0 ? formData.privilegedID : "",
    detail: Object.keys(formData).length !== 0 ? formData.detail : "",
  });
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const handleConfirm = async () => {
    let check = true;
    if (data.detail.trim().length === 0 || data.id.trim().length === 0) {
      if (typeof check === "boolean") check = "Không được để trống!";
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
      let newToken = await refreshTokenHandler(
        signInData.accessToken,
        dispatch
      );
      if (formType.includes("Thêm")) {
        let checkExisted = false;
        for (let i in privilegedList) {
          if (privilegedList[i].privilegedID === data.id) {
            checkExisted = true;
            break;
          }
        }
        if (checkExisted) {
          toast.error(`Mã phân quyền đã tồn tại!`, {
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
          createPrivileged({
            accessToken: newToken,
            data: {
              privilegedID: data.id,
              detail: data.detail,
            },
          });
          dispatch(
            privilegedListSlice.actions.addPrivileged({
              privilegedID: data.id,
              detail: data.detail,
              createdAt: getCurrentDate(),
              updatedAt: null,
              _destroy: false,
            })
          );
          toast.success(`Thêm phân quyền thành công`, {
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
            privilegedFormSlice.actions.setForm({
              type: "",
              data: {},
              show: false,
            })
          );
        }
      } else {
        updatePrivileged({
          accessToken: newToken,
          privilegedID: data.id,
          data: {
            detail: data.detail,
          },
        });
        let privileged = privilegedList.filter(
          (item) => item.privilegedID === data.id
        )[0];
        let updatedPrivileged = {
          ...privileged,
          detail: data.detail,
        };
        dispatch(
          privilegedListSlice.actions.updatePrivileged(updatedPrivileged)
        );
        toast.success(`Cập nhật phân quyền thành công`, {
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
          privilegedFormSlice.actions.setForm({
            type: "",
            data: {},
            show: false,
          })
        );
      }
    }
  };

  return (
    <div className="panel-container">
      <div className="panel-form-form">
        <div className="panel-title"> Quản lý tài khoản: {formType} </div>
        <div id="privileged-form">
          <div className="account-form-label"> Mã phân quyền </div>
          {formType.includes("Thêm") ? (
            <input
              className="account-form-input"
              value={data.id}
              name="id"
              style={{
                width: "20%",
                textAlign: "center",
              }}
              onChange={(e) => {
                setData(() => ({
                  ...data,
                  [e.target.name]: e.target.value,
                }));
              }}
            />
          ) : (
            <input defaultValue={formData.privilegedID} disabled />
          )}
          <div className="account-form-label"> Chi tiết/mô tả phân quyền </div>
          <textarea
            id="privileged-form-detail"
            name="detail"
            autoComplete="off"
            value={data.detail}
            onChange={(e) => {
              setData(() => ({
                ...data,
                [e.target.name]: e.target.value,
              }));
            }}
          />
          <div id="privileged-form-btn-section">
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
                  privilegedFormSlice.actions.setForm({
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
      </div>
    </div>
  );
};

export default PrivilegedForm;
