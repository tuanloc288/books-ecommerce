import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeVietnameseTones } from "../../../others/utilsAPI";
import { toast } from "react-toastify";
import accountMgmtSlice from "../../../../reducers/componentsReducer/accountMgmt/accountMgmtSlice";

const AccountFilterSection = () => {
  const showDes = useSelector((state) => state.accountMgmt.showDes);
  const accountList = useSelector((state) => state.getAccounts.accountsList);
  const dispatch = useDispatch();

  const [error, setError] = useState(false)
  const [data, setData] = useState({
    userName: "",
    isAvailable: false,
    privileged: "ALL",
  });

  useEffect(() => {
    return () => {
      dispatch(accountMgmtSlice.actions.setFilterList([]))
    }
  }, [])

  useEffect(() => {
    if(error){
      toast.error("Không tìm thấy tài khoản phù hợp!", {
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
  }, [error])
 
  useEffect(() => {
    if(accountList.length !== 0 && (data.userName.trim() !== '' || data.privileged !== 'ALL' || data.isAvailable !== false)){
      let local = handleSelect(data.privileged).filter(
        (item) =>
          item.userName.includes(removeVietnameseTones(data.userName.trim())) &&
          item.isAvailable === !data.isAvailable
      );
      dispatch(accountMgmtSlice.actions.setFilterList(local.length !== 0 ? local : []));
    }
  }, [accountList])

  const handleChange = (name, input) => {
    switch (name) {
      case "userName": {
        if(input.trim() !== '' || data.isAvailable || data.privileged !== 'ALL'){
          let local = handleSelect(data.privileged).filter(
            (item) =>
              item.userName.includes(removeVietnameseTones(input.trim())) &&
              item.isAvailable === (showDes ? false : !data.isAvailable)
          );
          if(local.length === 0 && !error){
            setError(true)
          }
          else if(local.length !== 0){
            setError(false)
            dispatch(accountMgmtSlice.actions.setFilterList(local));
          }
        }
        else{
          dispatch(accountMgmtSlice.actions.setFilterList([]))
        }
        break;
      }
      case "isAvailable":{
        if(input === true || data.userName.trim() !== '' || data.privileged !== 'ALL'){
          let local = handleSelect(data.privileged).filter(
            (item) =>
              item.userName.includes(removeVietnameseTones(data.userName.trim())) &&
              item.isAvailable === !input
          );
          if(local.length === 0)
            toast.error("Không tìm thấy tài khoản phù hợp!", {
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
          dispatch(accountMgmtSlice.actions.setFilterList(local.length !== 0 ? local : []));
        }
        else{
          dispatch(accountMgmtSlice.actions.setFilterList([]))
        }
        break;
      }
      case "privileged":{
        if(input !== 'ALL' || data.userName.trim() !== '' || data.isAvailable){
          let local = handleSelect(input).filter(
            (item) =>
              item.userName.includes(removeVietnameseTones(data.userName.trim())) &&
              item.isAvailable === (showDes ? false : !data.isAvailable)
          );
          if(local.length === 0)
            toast.error("Không tìm thấy tài khoản phù hợp!", {
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
          dispatch(accountMgmtSlice.actions.setFilterList(local.length !== 0 ? local : []));
        }
        else{
          dispatch(accountMgmtSlice.actions.setFilterList([]))
        }
        break;
      }
    }
    setData(() => ({
      ...data,
      [name]: input,
    }));
  };

  const handleSelect = (type) => {
    let mainList = showDes ? accountList.filter(item => item._destroy) : accountList.filter(item => !item._destroy)
    switch (type) {
      case "CTM": {
        return mainList.filter((item) => item.privileged.includes("CTM"));
      }
      case "HADM": {
        let list = [];
        for (let i in mainList) {
          if (
            mainList[i].privileged.includes("ADM-C") ||
            mainList[i].privileged.includes("ADM-R") ||
            mainList[i].privileged.includes("ADM-U") ||
            mainList[i].privileged.includes("ADM-D")
          )
            list.push(mainList[i]);
        }
        return list;
      }
      case "LADM": {
        let list = [];
        for (let i in mainList) {
          if (
            !mainList[i].privileged.includes("ADM-C") &&
            !mainList[i].privileged.includes("ADM-R") &&
            !mainList[i].privileged.includes("ADM-U") &&
            !mainList[i].privileged.includes("ADM-D") &&
            mainList[i].privileged.includes("ADM")
          )
            list.push(mainList[i]);
        }
        return list;
      }
      default: {
        return mainList;
      }
    }
  };

  return (
    <>
      <div className="management-filter-section">
        <div className="search-by-object">
          <div className="sub-title"> Tên tài khoản:</div>
          <input
            className="search-input"
            name="userName"
            placeholder="Tìm tên tài khoản..."
            value={data.userName}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          />
        </div>

        <div className="search-by-object">
          <div className="sub-title">
            Bị khóa:
            <input
              type="checkbox"
              name="isAvailable"
              style={{
                width: 20,
                height: 20,
              }}
              value={data.isAvailable}
              onChange={(e) => handleChange(e.target.name, e.target.checked)}
            />
          </div>
        </div>

        <div className="search-by-object">
          <div className="sub-title">
            Phân quyền:
            <select
              id="account-search-select"
              name="privileged"
              value={data.privileged}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            >
              <option value="ALL"> Tất cả </option>
              <option value="CTM"> Khách hàng </option>
              <option value="HADM"> Admin bậc cao </option>
              <option value="LADM"> Admin bậc thấp </option>
            </select>
          </div>
        </div>
      </div>
      <div className="search-btn-section">
        <button
          className="management-filter-btn"
          onClick={() => {
            setData({
              userName: '',
              isAvailable: false,
              privileged: 'ALL'
            })
            dispatch(accountMgmtSlice.actions.setFilterList([]))
          }}
        >
          {" "}
          Reset{" "}
        </button>
      </div>
    </>
  );
};

export default AccountFilterSection;
