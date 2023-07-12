import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import privilegedMgmtSlice from "../../../../reducers/componentsReducer/privilegedMgmt/privilegedMgmtSlice";
import { removeVietnameseTones } from "../../../others/utilsAPI";

const PrivilegedFilterSection = () => {
  const privilegedList = useSelector(
    (state) => state.getPrivileged.privilegedList
  );
  const [error, setError] = useState(false);
  const [data, setData] = useState({
    detail: "",
    select: "ALL",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(privilegedMgmtSlice.actions.setFilterList([]))
    }
  }, [])

  useEffect(() => {
    if (error) {
      toast.error("Không tìm thấy phân quyền phù hợp!", {
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
  }, [error]);

  const handleChange = (name, input) => {
    switch (name) {
      case "detail": {
        if (input.trim() !== "" || data.select !== "ALL") {
          let local = handleSelect(data.select).filter((item) =>
            removeVietnameseTones(item.detail).includes(removeVietnameseTones(input.trim()))
          );
          if (local.length === 0 && !error) {
            setError(true);
          } else if (local.length !== 0) {
            setError(false);
            dispatch(privilegedMgmtSlice.actions.setFilterList(local));
          }
        } else {
          dispatch(privilegedMgmtSlice.actions.setFilterList([]));
        }
        break;
      }
      case "select": {
        if (input !== "ALL" || data.detail.trim() !== "") {
          let local = handleSelect(input).filter((item) =>
            removeVietnameseTones(item.detail).includes(removeVietnameseTones(data.detail.trim()))
          );
          if (local.length === 0)
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
          dispatch(
            privilegedMgmtSlice.actions.setFilterList(
              local.length !== 0 ? local : []
            )
          );
        } else {
          dispatch(privilegedMgmtSlice.actions.setFilterList([]));
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
    if (type !== "ALL") {
      let list = [];
      for (let i in privilegedList) {
        if(privilegedList[i].privilegedID !== 'ADM-S'){
            let temp = privilegedList[i].privilegedID.split("-");
            if (temp.length === 2 || temp[1] === type) list.push(privilegedList[i]);
        }
      }
      return list;
    } else return privilegedList;
  };

  return (
    <>
      <div className="management-filter-section">
        <div className="search-by-object">
          <div className="sub-title"> Chi tiết:</div>
          <input
            className="search-input"
            name="detail"
            placeholder="Tìm theo chi tiết..."
            value={data.detail}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          />
        </div>

        <div className="search-by-object">
          <div className="sub-title">
            Liên quan đến:
            <select
              id="account-search-select"
              name="select"
              value={data.select}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            >
              <option value="ALL"> Tất cả </option>
              <option value="A"> Tài khoản </option>
              <option value="B"> Hóa đơn </option>
              <option value="C"> Thể loại sách </option>
              <option value="D"> Khuyến mãi </option>
              <option value="P"> Sách </option>
              <option value="W"> Nhập kho </option>
              <option value="PR"> Phân quyền </option>
            </select>
          </div>
        </div>
      </div>
      <div className="search-btn-section">
        <button
          className="management-filter-btn"
          onClick={() => {
            setData({
              detail: "",
              select: 'ALL'
            });
            dispatch(privilegedMgmtSlice.actions.setFilterList([]));
          }}
        >
          Reset
        </button>
      </div>
    </>
  );
};

export default PrivilegedFilterSection;
