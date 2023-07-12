import "./accountManagement.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateAccount } from "../../../../reducers/apiReducer/accountAPI/updateAccount";
import { deleteAccount } from "../../../../reducers/apiReducer/accountAPI/deleteAccount";
import { refreshTokenHandler } from "../../../../reducers/apiReducer/signFormAPI/refreshToken";
import { toast } from "react-toastify";
import mergeSlice from "../../../../reducers/componentsReducer/mergeMgmt/mergeMgmtSlice";
import accountSlice from "../../../../reducers/apiReducer/accountAPI/getAllAccounts";
import accountFormSlice from "../../../../reducers/componentsReducer/accountMgmt/accountMgmtSlice";
import accountMgmtSlice from "../../../../reducers/componentsReducer/accountMgmt/accountMgmtSlice";
import confirmDialogSlice from "../../../../reducers/componentsReducer/confirmDialog/confirmDialogSlice";

const AccountManagement = () => {
  const accountList = useSelector((state) => state.getAccounts.accountsList);
  const signInData = useSelector((state) => state.signIn.data);
  const filter = useSelector((state) => state.mergeMgmt.filterDisplay);
  const privilegedList = useSelector(
    (state) => state.getPrivileged.privilegedList
  );
  const showDes = useSelector((state) => state.accountMgmt.showDes);
  const filterList = useSelector((state) => state.accountMgmt.filterList);
  const dialog = useSelector(state => state.confirmDialog.confirmation)
  const destroyList = filterList.length !== 0 ? filterList.filter((item) => item._destroy) : accountList.filter((item) => item._destroy);
  const noDesList = filterList.length !== 0 ? filterList.filter((item) => !item._destroy) : accountList.filter((item) => !item._destroy);
  const [displayList, setDisplayList] = useState([]);
  const [accPriList, setAccPriList] = useState([]);
  const [checked, setChecked] = useState({});
  const [deleteID, setDeleteID] = useState('')
  const dispatch = useDispatch();

  useEffect(() => {
    if (accountList.length !== 0) {
      let local = [];
      for (let i in noDesList) {
        local[noDesList[i].userName] = [];
        for (let y in privilegedList) {
          let temp = { ...privilegedList[y] };
          let check = noDesList[i].privileged.includes(temp.privilegedID);
          temp.included = check;
          local[noDesList[i].userName].push(temp);
        }
      }
      let tempChecked = {};
      for (let i in local[noDesList[0].userName]) {
        tempChecked[local[noDesList[0].userName][i].privilegedID] =
          local[noDesList[0].userName][i].included;
      }
      if(displayList.length === 0){
        setChecked(tempChecked);
        setDisplayList(local[noDesList[0].userName]);
      }
      setAccPriList(local);
    }
  }, [accountList]);

  useEffect(() => {
    if (privilegedList.length !== 0 && displayList.length !== 0) {
      let user = document.getElementById(
        "accountMgmt-pri-section-left-select"
      ).value;
      let list = showDes ? destroyList : noDesList
      let local = [];
      for (let i in list) {
        local[list[i].userName] = [];
        for (let y in privilegedList) {
          let temp = { ...privilegedList[y] };
          let check = list[i].privileged.includes(temp.privilegedID);
          temp.included = check;
          local[list[i].userName].push(temp);
        }
      }
      let tempChecked = {};
      for (let i in local[user]) {
        tempChecked[local[user][i].privilegedID] =
          local[user][i].included;
      }
      setChecked(tempChecked);
      setDisplayList(local[user]);
      setAccPriList(local);
    }
  }, [privilegedList, filterList]);

  useEffect(() => {
    if(dialog.res && dialog.title !== '' && deleteID !== '') {
        dispatch(confirmDialogSlice.actions.setConfirmDialog({show: false, title: '', res: false}))
        setDeleteID('')
        toast.success(`Xóa vĩnh viễn ${deleteID} thành công!`, {
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
          deleteAccount({
            userName: deleteID,
            accessToken: newToken,
          });
          dispatch(accountSlice.actions.removeAccount(deleteID));
          if (destroyList.length === 1) {
            dispatch(accountMgmtSlice.actions.setShowDes(false));
          }
        } 
        deleting()
    }
    else if(!dialog.res && document.body.classList[0] === 'modal-open')
      document.body.classList.remove("modal-open");
  }, [dialog])

  const handleSelect = (user) => {
    let tempChecked = {};
    for (let i in accPriList[user]) {
      tempChecked[accPriList[user][i].privilegedID] =
        accPriList[user][i].included;
    }
    setChecked(tempChecked);
    setDisplayList(accPriList[user]);
  };

  const handleCheckBox = (id) => {
    if (showDes) {
      toast.error("Không thể phân quyền khi tài khoản đã bị tạm xóa!", {
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
      let user = document.getElementById(
        "accountMgmt-pri-section-left-select"
      ).value;
      let checkAdmin = true;
      let array = showDes ? destroyList : noDesList;
      for (let i in array) {
        if (
          array[i].userName === user &&
          !array[i].privileged.includes("ADM")
        ) {
          checkAdmin = false;
          break;
        }
      }
      if (!checkAdmin) {
        toast.warning(
          "Hãy phân quyền ADM cho tài khoản này trước khi phân quyền cụ thể!",
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
        setTimeout(() => {
          toast.info(
            "Tick vào checkbox của tài khoản này ở table phía trên để phân quyền ADM",
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
        }, 2000);
      } else {
        // handle privileged type
        let handleType = id.split("-");
        if (handleType.length === 2) {
          if (handleType[1] !== "S") {
            if(!accountList.filter(item => item.userName === signInData.user.userName)[0].privileged.includes('ADM-U') && signInData.user.userName !== 'booksecommerce2022@gmail.com'){
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
            }
            else {
              if (handleType[1] !== "R") {
                if (!checked["ADM-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-R"]: true,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              } else if (handleType[1] === "R") {
                if (checked["ADM-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-C"]: false,
                    ["ADM-U"]: false,
                    ["ADM-D"]: false,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              } 
            }
          } else {
            if (checked[id]) {
              setChecked(() => ({
                ...checked,
                [id]: !checked[id],
                ["ADM-P-R"]: false,
                ["ADM-C-R"]: false,
                ["ADM-B-R"]: false,
                ["ADM-W-R"]: false,
                ["ADM-D-R"]: false,
              }));
            } else {
              setChecked(() => ({
                ...checked,
                [id]: !checked[id],
                ["ADM-P-R"]: true,
                ["ADM-C-R"]: true,
                ["ADM-B-R"]: true,
                ["ADM-W-R"]: true,
                ["ADM-D-R"]: true,
              }));
            }
          }
        } else if (handleType.length === 3) {
          switch (handleType[1]) {
            case "P": {
              if (handleType[2] !== "R") {
                if (!checked["ADM-P-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-P-R"]: true,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              } else if (handleType[2] === "R") {
                if (checked["ADM-P-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-P-C"]: false,
                    ["ADM-P-U"]: false,
                    ["ADM-P-D"]: false,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              }
              break;
            }
            case "C": {
              if (handleType[2] !== "R") {
                if (!checked["ADM-C-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-C-R"]: true,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              } else if (handleType[2] === "R") {
                if (checked["ADM-C-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-C-C"]: false,
                    ["ADM-C-U"]: false,
                    ["ADM-C-D"]: false,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              }
              break;
            }
            case "A": {
              if (handleType[2] !== "R") {
                if (!checked["ADM-A-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-A-R"]: true,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              } else if (handleType[2] === "R") {
                if (checked["ADM-A-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-A-C"]: false,
                    ["ADM-A-U"]: false,
                    ["ADM-A-D"]: false,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              }
              break;
            }
            case "B": {
              if (handleType[2] !== "R") {
                if (!checked["ADM-B-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-B-R"]: true,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              } else if (handleType[2] === "R") {
                if (checked["ADM-B-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-B-UD"]: false,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              }
              break;
            }
            case "PR": {
              if (handleType[2] !== "R") {
                if (!checked["ADM-PR-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-PR-R"]: true,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              } else if (handleType[2] === "R") {
                if (checked["ADM-PR-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-PR-C"]: false,
                    ["ADM-PR-U"]: false,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              }
              break;
            }
            case "W": {
              if (handleType[2] !== "R") {
                if (!checked["ADM-W-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-W-R"]: true,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              } else if (handleType[2] === "R") {
                if (checked["ADM-W-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-W-CUD"]: false,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              }
              break;
            }
            case "D": {
              if (handleType[2] !== "R") {
                if (!checked["ADM-D-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-D-R"]: true,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              } else if (handleType[2] === "R") {
                if (checked["ADM-D-R"]) {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                    ["ADM-D-C"]: false,
                    ["ADM-D-U"]: false,
                    ["ADM-D-D"]: false,
                  }));
                } else {
                  setChecked(() => ({
                    ...checked,
                    [id]: !checked[id],
                  }));
                }
              }
              break;
            }
          }
        }
      }
    }
  };

  const handleSaveChanged = () => {
    if (checkRight("U")) {
      toast.error("Bạn không có quyền chỉnh sửa tài khoản!", {
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
      if (showDes) {
        toast.error("Không thể phân quyền khi tài khoản đã bị tạm xóa!", {
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
        let tempCheck = false;
        let user = document.getElementById(
          "accountMgmt-pri-section-left-select"
        ).value;
        if (
          user === "booksecommerce2022@gmail.com" &&
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
          for (let i in accPriList[user]) {
            if (
              accPriList[user][i].included !==
              checked[accPriList[user][i].privilegedID]
            ) {
              tempCheck = true;
              break;
            }
          }
          if (!tempCheck) {
            toast.warning("Chưa có thay đổi gì để lưu!", {
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
            toast.success("Lưu thành công!", {
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
            let tickedList = [];
            for (let i in accPriList[user]) {
              if (checked[accPriList[user][i].privilegedID]) {
                tickedList.push(accPriList[user][i].privilegedID);
              }
            }
            dispatch(
              updateAccount({
                userName: user,
                data: { privileged: tickedList },
              })
            );
            let account = accountList.filter(
              (item) => item.userName === user
            )[0];
            account = { ...account, privileged: tickedList };
            dispatch(accountSlice.actions.updateAccount(account));
          }
        }
      }
    }
  };

  const handleIsAdmin = (check, user) => {
    if (checkRight("U")) {
      toast.error("Bạn không có quyền chỉnh sửa tài khoản!", {
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
      if (showDes) {
        toast.error("Không thể phân quyền khi tài khoản đã bị tạm xóa!", {
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
        let account = accountList.filter((item) => item.userName === user)[0];
        if (account.privileged.includes("ADM")) {
          if (
            !check &&
            user !== signInData.user.userName &&
            user !== "booksecommerce2022@gmail.com"
          ) {
            toast.warning(`Tài khoản ${user} đã mất toàn bộ quyền admin!`, {
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
            setTimeout(() => {
              toast.success(`Cập nhật thành công!`, {
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
            }, 1000);
            let tempChecked = {};
            for (let i in accPriList[user]) {
              if (accPriList[user][i].privilegedID === "CTM")
                tempChecked[accPriList[user][i].privilegedID] = true;
              else tempChecked[accPriList[user][i].privilegedID] = false;
            }
            document.getElementById(
              "accountMgmt-pri-section-left-select"
            ).value = user;
            setChecked(tempChecked);
            // setDisplayList(accPriList[user])
            account = { ...account, privileged: ["CTM"] };
            dispatch(
              updateAccount({ userName: user, data: { privileged: ["CTM"] } })
            );
            dispatch(accountSlice.actions.updateAccount(account));
          } else {
            toast.error(
              "Không thể xóa quyền admin của chính mình (hoặc của admin chính)!",
              {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                pauseOnFocusLoss: false,
                progress: undefined,
                theme: "dark",
              }
            );
          }
        } else if (check) {
          toast.success("Cập nhật thành công!", {
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
          let tempChecked = {};
          for (let i in accPriList[user]) {
            if (accPriList[user][i].privilegedID === "ADM")
              tempChecked[accPriList[user][i].privilegedID] = true;
            else tempChecked[accPriList[user][i].privilegedID] = false;
          }
          document.getElementById("accountMgmt-pri-section-left-select").value =
            user;
          setChecked(tempChecked);
          account = { ...account, privileged: ["ADM"] };
          dispatch(
            updateAccount({ userName: user, data: { privileged: ["ADM"] } })
          );
          dispatch(accountSlice.actions.updateAccount(account));
        }
      }
    }
  };

  const handleSetIsAvailable = async (e) => {
    if (checkRight("U")) {
      toast.error("Bạn không có quyền chỉnh sửa tài khoản!", {
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
      if (showDes) {
        toast.error("Không thể gỡ khóa khi tài khoản đã bị tạm xóa!", {
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
        const accountID = e.target.attributes.value.value;
        if (accountID === "booksecommerce2022@gmail.com") {
          toast.error(`Không thể khóa tài khoản admin chính`, {
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
        } else if (accountID === signInData.user.userName) {
          toast.error("Không thể khóa tài khoản chính mình!", {
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
          const parentClassName = e.target.parentElement.className;
          const parentEle = e.target.parentElement;
          const childEle = e.target;
          if (parentClassName === "btn-change-status-true") {
            childEle.style.animationName = "rightToLeft";
            childEle.style.animationDuration = "0.5s";
            childEle.style.animationFillMode = "forwards";
            parentEle.style.backgroundColor = "rgb(243, 238, 238)";
            parentEle.classList.remove("btn-change-status-true");
            parentEle.classList.add("btn-change-status-false");
            childEle.classList.remove("btn-change-status-true-circle");
            childEle.classList.add("btn-change-status-false-circle");
          } else {
            childEle.style.animationName = "leftToRight";
            childEle.style.animationDuration = "0.5s";
            childEle.style.animationFillMode = "forwards";
            parentEle.style.backgroundColor = "var(--letter-color)";
            parentEle.classList.remove("btn-change-status-false");
            parentEle.classList.add("btn-change-status-true");
            childEle.classList.remove("btn-change-status-false-circle");
            childEle.classList.add("btn-change-status-true-circle");
          }
          dispatch(
            updateAccount({
              userName: accountID,
              data: { isAvailable: !parentClassName.includes("status-true") },
            })
          );
          let account = accountList.filter(
            (item) => item.userName === accountID
          )[0];
          account = {
            ...account,
            isAvailable: !parentClassName.includes("status-true"),
          };
          dispatch(accountSlice.actions.updateAccount(account));
          toast.success(`Cập nhật thành công!`, {
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
        }
      }
    }
  };

  const handleRemoveAccount = async (account) => {
    if (checkRight("D")) {
      toast.error("Bạn không có quyền xóa tạm thời tài khoản!", {
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
      if (account.userName === "booksecommerce2022@gmail.com") {
        toast.error("Không thể xóa admin chính!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (signInData.user.userName === account.userName) {
        toast.error("Không thể xóa chính mình!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        if (account.privileged.includes("ADM")) {
          dispatch(
            updateAccount({
              userName: account.userName,
              data: { privileged: ["CTM"], isAvailable: false, _destroy: true },
            })
          );
          let updatedAccount = {
            ...account,
            privileged: ["CTM"],
            isAvailable: false,
            _destroy: true,
          };
          dispatch(accountSlice.actions.updateAccount(updatedAccount));
          toast.success(`Xóa tạm thời ${account.userName} thành công!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          if (showDes) {
            if(signInData.user.userName !== 'booksecommerce2022@gmail.com'){
              toast.error("Bạn không có quyền xóa vĩnh viễn tài khoản!", {
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
            else {
              dispatch(confirmDialogSlice.actions.setConfirmDialog({show: true, title: 'Bạn có chắc muốn xóa vĩnh viễn tài khoản này không?', res: false}))
            }
          } else {
            dispatch(
              updateAccount({
                userName: account.userName,
                data: { isAvailable: false, _destroy: true },
              })
            );
            let updatedAccount = {
              ...account,
              isAvailable: false,
              _destroy: true,
            };
            dispatch(accountSlice.actions.updateAccount(updatedAccount));
            toast.success(`Xóa tạm thời ${account.userName} thành công!`, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }
        }
      }
    }
  };

  const handleShowAccountDes = (check) => {
    if (destroyList.length === 0 && check) {
      toast.warning("Chưa có tài khoản nào bị tạm xóa!", {
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
      if (check) {
        let local = [];
        for (let i in destroyList) {
          local[destroyList[i].userName] = [];
          for (let y in privilegedList) {
            let temp = { ...privilegedList[y] };
            let tempCheck = destroyList[i].privileged.includes(
              temp.privilegedID
            );
            temp.included = tempCheck;
            local[destroyList[i].userName].push(temp);
          }
        }
        let tempChecked = {};
        for (let i in local[destroyList[0].userName]) {
          tempChecked[local[destroyList[0].userName][i].privilegedID] =
            local[destroyList[0].userName][i].included;
        }
        setChecked(tempChecked);
        setDisplayList(local[destroyList[0].userName]);
        setAccPriList(local);
      } else {
        let local = [];
        for (let i in noDesList) {
          local[noDesList[i].userName] = [];
          for (let y in privilegedList) {
            let temp = { ...privilegedList[y] };
            let check = noDesList[i].privileged.includes(temp.privilegedID);
            temp.included = check;
            local[noDesList[i].userName].push(temp);
          }
        }
        let tempChecked = {};
        for (let i in local[noDesList[0].userName]) {
          tempChecked[local[noDesList[0].userName][i].privilegedID] =
            local[noDesList[0].userName][i].included;
        }
        setChecked(tempChecked);
        setDisplayList(local[noDesList[0].userName]);
        setAccPriList(local);
      }
      dispatch(accountMgmtSlice.actions.setShowDes(check));
    }
  };

  const handleFormEdit = (type ,userName) => {
    if(type === 2){
      if (checkRight("C")) {
        toast.error("Bạn không có quyền tạo tài khoản!", {
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
      else {
        dispatch(
          accountFormSlice.actions.setForm({
            type: "Thêm tài khoản",
            data: {},
            show: true,
          })
        );
      }
    }
    else {
      if (checkRight("U")) {
        toast.error("Bạn không có quyền chỉnh sửa tài khoản!", {
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
        if (showDes) {
          toast.error("Không thể chỉnh sửa khi tài khoản đã bị tạm xóa!", {
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
          if(userName === 'booksecommerce2022@gmail.com' && signInData.user.userName !== 'booksecommerce2022@gmail.com'){
            toast.error("Bạn không có quyền chỉnh sửa admin chính!", {
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
          else {
            let privileged = {};
            for (let i in accPriList[userName]) {
              privileged[accPriList[userName][i].privilegedID] =
                accPriList[userName][i].included;
            }
            dispatch(
              accountFormSlice.actions.setForm({
                type: "Chỉnh sửa tài khoản",
                data: { userName, privileged: privileged },
                show: true,
              })
            );
          }
        }
      }      
    }
  };

  const checkRight = (type) => {
    let account = accountList.filter(item => item.userName === signInData.user.userName)[0]
    return (
      !account.privileged.includes(`ADM-A-${type}`) &&
      !account.privileged.includes(`ADM-${type}`)
    );
  };

  return (
    <div
      className="panel-container"
      style={{
        maxHeight: 450,
        height: 450,
      }}
    >
      <div className="panel-title"> Quản lý tài khoản </div>
      <div className="panel-content">
        <div className="panel-btns">
          <div className="panel-btns-action">
            <button
              className="btn btn-green"
              onClick={() => {
                handleFormEdit(2)
              }}
            >
              Tạo tài khoản
            </button>
            {filter ? (
              <button
                className="btn btn-red"
                style={{
                  width: "fit-content",
                }}
                onClick={() => {
                  dispatch(mergeSlice.actions.setFilterDisplay(false));
                }}
              >
                Chuyển tìm kiếm
              </button>
            ) : null}
          </div>
          <div className="panel-btns-checkbox">
            <label> Các tài khoản bị tạm xóa </label>
            <input
              type={"checkbox"}
              style={{
                cursor: "pointer",
              }}
              onChange={(e) => handleShowAccountDes(e.target.checked)}
              id="checkedAccountDes"
              checked={showDes}
            ></input>
          </div>
        </div>
        <div
          className="panel-table"
          style={{
            maxHeight: 220,
            height: 220,
            overflowY: "scroll",
          }}
        >
          <table>
            <thead>
              <tr>
                <th> STT </th>
                <th> Tài khoản </th>
                <th> Khả dụng </th>
                <th> Ngày tạo </th>
                <th> Admin </th>
                <th> Hành động </th>
              </tr>
            </thead>
            <tbody>
              {!showDes
                ? noDesList.map((item, index) => {
                    return (
                      <tr key={item.userName}>
                        <th> {index + 1} </th>
                        <th>{item.userName}</th>
                        <th>
                          {item.isAvailable === true ? (
                            <div className="btn-change-status-true">
                              <div
                                className="btn-change-status-true-circle"
                                onClick={handleSetIsAvailable}
                                value={item.userName}
                              ></div>
                            </div>
                          ) : (
                            <div className="btn-change-status-false">
                              <div
                                className="btn-change-status-false-circle"
                                onClick={handleSetIsAvailable}
                                value={item.userName}
                              ></div>
                            </div>
                          )}
                        </th>
                        <th>{item.createdAt}</th>
                        <th>
                          {" "}
                          <input
                            type="checkbox"
                            className="accountMgmt-pri-section-checkbox"
                            checked={item.privileged.includes("ADM")}
                            onChange={(e) =>
                              handleIsAdmin(e.target.checked, item.userName)
                            }
                          />{" "}
                        </th>
                        <th>
                          <button
                            className="btn btn-form-edit"
                            onClick={() => {
                              handleFormEdit(1 ,item.userName);
                            }}
                          >
                            <i className="fa-solid fa-gear"></i>
                          </button>
                          <button
                            className="btn btn-form-trash"
                            onClick={() => 
                              {
                                handleRemoveAccount(item)
                                setDeleteID(item.userName)
                              }}
                          >
                            <i
                              className={`fa-solid fa-trash ${
                                item.userName === "booksecommerce2022@gmail.com"
                                  ? "unable"
                                  : null
                              }`}
                            ></i>
                          </button>
                        </th>
                      </tr>
                    );
                  })
                : destroyList.map((item, index) => {
                    return (
                      <tr key={item.userName}>
                        <th> {index + 1} </th>
                        <th>{item.userName}</th>
                        <th>
                          {item.isAvailable === true ? (
                            <div className="btn-change-status-true">
                              <div
                                className="btn-change-status-true-circle"
                                onClick={handleSetIsAvailable}
                                value={item.userName}
                              ></div>
                            </div>
                          ) : (
                            <div className="btn-change-status-false">
                              <div
                                className="btn-change-status-false-circle"
                                onClick={handleSetIsAvailable}
                                value={item.userName}
                              ></div>
                            </div>
                          )}
                        </th>
                        <th>{item.createdAt}</th>
                        <th>
                          {" "}
                          <input
                            type="checkbox"
                            className="accountMgmt-pri-section-checkbox"
                            checked={item.privileged.includes("ADM")}
                            onChange={(e) =>
                              handleIsAdmin(e.target.checked, item.userName)
                            }
                          />{" "}
                        </th>
                        <th>
                          <button
                            className="btn btn-form-edit"
                            onClick={() => {
                              handleFormEdit(1, item.userName);
                            }}
                          >
                            <i className="fa-solid fa-gear"></i>
                          </button>
                          <button
                            className="btn btn-form-trash"
                            onClick={() => {
                              handleRemoveAccount(item)
                              setDeleteID(item.userName)
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
        <div id="accountMgmt-pri-section">
          <div id="accountMgmt-pri-section-left">
            <span id="accountMgmt-pri-section-left-span">
              {" "}
              Chọn 1 tài khoản để xem quyền:{" "}
            </span>
            <select
              id="accountMgmt-pri-section-left-select"
              onChange={(e) => handleSelect(e.target.value)}
            >
              {!showDes
                ? noDesList.map((item) => {
                    return (
                      <option key={item.userName} value={item.userName}>
                        {" "}
                        {item.userName}{" "}
                      </option>
                    );
                  })
                : destroyList.map((item) => {
                    return (
                      <option key={item.userName} value={item.userName}>
                        {" "}
                        {item.userName}{" "}
                      </option>
                    );
                  })}
            </select>
            <button className="btn btn-red" onClick={() => handleSaveChanged()}>
              {" "}
              Lưu thay đổi{" "}
            </button>
          </div>
          <div id="accountMgmt-pri-section-right">
            {displayList.map((item) => {
              if (item.privilegedID !== "ADM" && item.privilegedID !== "CTM")
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
                      checked={checked[item.privilegedID]}
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

export default AccountManagement;
