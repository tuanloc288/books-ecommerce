import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { refreshTokenHandler } from "../../../../reducers/apiReducer/signFormAPI/refreshToken";
import { deletePrivileged } from "../../../../reducers/apiReducer/privilegedAPI/deletePrivileged";
import { toast } from "react-toastify";
import mergeSlice from "../../../../reducers/componentsReducer/mergeMgmt/mergeMgmtSlice";
import privilegedFormSlice from "../../../../reducers/componentsReducer/privilegedMgmt/privilegedMgmtSlice";
import privilegedListSlice from "../../../../reducers/apiReducer/privilegedAPI/getAllPrivileged";
import confirmDialogSlice from "../../../../reducers/componentsReducer/confirmDialog/confirmDialogSlice";

const PrivilegedManagement = () => {
  const privilegedList = useSelector(
    (state) => state.getPrivileged.privilegedList
  );
  const filterList = useSelector((state) => state.privilegedMgmt.filterList);
  let displayList = filterList.length !== 0 ? filterList : privilegedList;
  const accountList = useSelector((state) => state.getAccounts.accountsList);
  const signInData = useSelector((state) => state.signIn.data);
  const filter = useSelector((state) => state.mergeMgmt.filterDisplay);
  const dialog = useSelector((state) => state.confirmDialog.confirmation);
  const dispatch = useDispatch();
  const [deleteID, setDeleteID] = useState("");

  useEffect(() => {
    if (dialog.res && dialog.title !== "" && deleteID !== "") {
      dispatch(
        confirmDialogSlice.actions.setConfirmDialog({
          show: false,
          title: "",
          res: false,
        })
      );
      setDeleteID("");
      toast.success(`Xóa vĩnh viễn phân quyền ${deleteID} thành công!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      let deleting = async () => {
        const newToken = await refreshTokenHandler(
          signInData.accessToken,
          dispatch
        );
        deletePrivileged({ privilegedID: deleteID, accessToken: newToken });
        dispatch(privilegedListSlice.actions.removePrivileged(deleteID));
      };
      deleting();
    }
    else if(!dialog.res && document.body.classList[0] === 'modal-open')
      document.body.classList.remove("modal-open");
  }, [dialog]);

  const checkRight = (type) => {
    let account = accountList.filter(
      (item) => item.userName === signInData.user.userName
    )[0];
    return (
      !account.privileged.includes(`ADM-PR-${type}`) &&
      !account.privileged.includes(`ADM-${type}`)
    );
  };

  const handleDeletePrivileged = async (id) => {
    let checkPri = false;
    for (let i in accountList) {
      if (
        accountList[i].privileged.includes("ADM-D") &&
        accountList[i].userName === signInData.user.userName
      ) {
        checkPri = true;
        break;
      }
    }
    if (
      signInData.user.userName !== "booksecommerce2022@gmail.com" ||
      !checkPri
    ) {
      toast.error("Bạn không có quyền xóa phân quyền!", {
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
      dispatch(
        confirmDialogSlice.actions.setConfirmDialog({
          show: true,
          title: "Bạn có chắc muốn xóa vĩnh viễn phân quyền này không?",
          res: false,
        })
      );
    }
  };

  const handleChangeForm = (type, data) => {
    if (type === 1) {
      if (!checkRight("C")) {
        dispatch(
          privilegedFormSlice.actions.setForm({
            type: "Thêm phân quyền mới",
            data: {},
            show: true,
          })
        );
      } else {
        toast.error("Bạn không có quyền tạo phân quyền!", {
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
      }
    } else {
      if (!checkRight("U")) {
        dispatch(
          privilegedFormSlice.actions.setForm({
            type: "Chỉnh sửa phân quyền",
            data,
            show: true,
          })
        );
      } else {
        toast.error("Bạn không có quyền chỉnh sửa phân quyền!", {
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
      }
    }
  };

  return (
    <div
      className="panel-container"
      style={{
        marginTop: 10,
        maxHeight: 300,
        height: 300,
      }}
    >
      <div className="panel-title"> Quản lý phân quyền </div>
      <div className="panel-content">
        <div className="panel-btns">
          <div className="panel-btns-action">
            <button
              className="btn btn-green"
              style={{
                width: "fit-content",
              }}
              onClick={() => handleChangeForm(1, {})}
            >
              Tạo phân quyền mới
            </button>
            {!filter ? (
              <button
                className="btn btn-red"
                style={{
                  width: "fit-content",
                }}
                onClick={() => {
                  dispatch(mergeSlice.actions.setFilterDisplay(true));
                }}
              >
                Chuyển tìm kiếm
              </button>
            ) : null}
          </div>
        </div>
        <div
          className="panel-table"
          style={{
            maxHeight: 200,
            height: 200,
            overflowY: "scroll",
          }}
        >
          <table>
            <thead>
              <tr>
                <th> STT </th>
                <th> Mã quyền </th>
                <th> Chi tiết </th>
                <th> Ngày tạo </th>
                <th> Hành động </th>
              </tr>
            </thead>
            <tbody>
              {displayList.map((item, index) => {
                return (
                  <tr key={item.privilegedID}>
                    <th> {index + 1} </th>
                    <th>{item.privilegedID}</th>
                    <th>{item.detail}</th>
                    <th>{item.createdAt}</th>
                    <th>
                      <button
                        className="btn btn-form-edit"
                        onClick={() =>
                          handleChangeForm(2, {
                            privilegedID: item.privilegedID,
                            detail: item.detail,
                          })
                        }
                      >
                        <i className="fa-solid fa-gear"></i>
                      </button>
                      <button
                        className="btn btn-form-trash"
                        onClick={() => {
                          handleDeletePrivileged(item.privilegedID);
                          setDeleteID(item.privilegedID);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrivilegedManagement;
