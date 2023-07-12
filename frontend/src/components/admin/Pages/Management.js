import "./management.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../../../reducers/apiReducer/signFormAPI/signOut";
import { toast, ToastContainer } from "react-toastify";
import ProductManagement from "./productManagement/ProductManagement";
import CategoryManagement from "./categoryManagement/CategoryManagement";
import BillManagement from "./billManagement/BillManagement";
import WarehouseManagement from "./warehouseManagement/WarehouseManagement";
import BooksFilterSection from "./searchSection/BooksFilterSection";
import CategoryFilterSection from "./searchSection/CategoryFilterSection";
import WarehouseFilterSection from "./searchSection/WarehouseFilterSection";
import StatisticManagement from "./statisticManagement/StatisticManagement";
import BillFilterSection from "./searchSection/BillFilterSection";
import purchaseHistorySlice from "../../../reducers/componentsReducer/purchaseHistory/purchaseHistorySlice";
import ErrorNotFound from "./ErrorNotFound";
import cartSlice from "../../../reducers/componentsReducer/carts/cartSlice";
import MergeManagement from "./mergeManagement/MergeManagement";
import AccountFilterSection from "./searchSection/AccountFilterSection";
import PrivilegedFilterSection from "./searchSection/PrivilegedFilterSection";
import DiscountManagement from "./discountManagement/DiscountManagement";
import DiscountAccountFilterSection from "./searchSection/DiscountAccountFilterSection";
import DiscountCategoryFilterSection from "./searchSection/DiscountCategoryFilterSection";
import ConfirmDialog from "../../others/ConfirmDialog";
import StatisticFilterSection from "./searchSection/StatisticFilterSection";

const Management = () => {
  const [render, setRender] = useState("SP");
  const mergerFilter = useSelector((state) => state.mergeMgmt.filterDisplay);
  const discountFilter = useSelector(
    (state) => state.discountMgmt.filterDisplay
  );
  const accountList = useSelector((state) => state.getAccounts.accountsList);
  const dialog = useSelector((state) => state.confirmDialog.confirmation);
  const signInData = useSelector((state) => state.signIn.data);
  const dispatch = useDispatch();
  const managementItems = [
    {
      key: "SP",
      detail: "Sản phẩm",
    },
    {
      key: "TL",
      detail: "Thể loại",
    },
    {
      key: "HD",
      detail: "Hóa đơn",
    },
    {
      key: "GOP",
      detail: "Tài khoản/Phân quyền",
    },
    {
      key: "KH",
      detail: "Nhập kho",
    },
    {
      key: "TKE",
      detail: "Thống kê",
    },
    {
      key: "ERR",
    },
  ];

  useEffect(() => {
    let handleAsync = async () => {
      for (let i in accountList) {
        if (
          accountList[i].userName === signInData.user?.userName &&
          !accountList[i].privileged.includes("ADM")
        ) {
          setRender("ERR");
          await signOut(dispatch);
          dispatch(cartSlice.actions.setCartList([]));
          dispatch(purchaseHistorySlice.actions.setBillID(""));
          dispatch(purchaseHistorySlice.actions.setBillList([]));
          dispatch(purchaseHistorySlice.actions.setBillDetailList([]));
          break;
        }
      }
    };
    handleAsync();
  }, [accountList]);

  useEffect(() => {
    if (Object.keys(signInData).length === 0) {
      setRender("ERR");
    } else {
      setRender("SP");
    }
  }, [signInData]);

  const handleChangeUI = (key, index) => {
    if (Object.keys(signInData).length !== 0) {
      setRender(key);
      addActive(index);
    } else {
      toast.error(`Vui lòng đăng nhập lại!`, {
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
  };

  const checkPrivileged = (type) => {
    let account = accountList.filter(
      (item) => item.userName === signInData.user?.userName
    )[0];
    return (
      account?.privileged.includes("ADM-R") ||
      account?.privileged.includes("ADM-S") ||
      account?.privileged.includes(`ADM-${type}-R`)
    );
  };

  const handleRenderRight = () => {
    switch (render) {
      case "SP": {
        if (checkPrivileged("P")) return <ProductManagement />;
        else return <ErrorNotFound />;
      }
      case "TL": {
        if (checkPrivileged("C")) return <CategoryManagement />;
        else return <ErrorNotFound />;
      }
      case "HD": {
        if (checkPrivileged("B")) return <BillManagement />;
        else return <ErrorNotFound />;
      }
      case "TKE": {
        if (checkPrivileged("S")) return <StatisticManagement />;
        else return <ErrorNotFound />;
      }
      case "GOP": {
        let account = accountList.filter(
          (item) => item.userName === signInData.user?.userName
        )[0];
        if (
          (account?.privileged.includes("ADM-PR-R") &&
            account?.privileged.includes("ADM-A-R")) ||
          account?.privileged.includes("ADM-R")
        )
          return <MergeManagement />;
        else return <ErrorNotFound />;
      }
      case "KH": {
        if (checkPrivileged("W")) return <WarehouseManagement />;
        else return <ErrorNotFound />;
      }
      case "ERR":
        return <ErrorNotFound />;
      default:
        return <ErrorNotFound />;
    }
  };

  const handleRenderLeft = () => {
    switch (render) {
      case "SP": {
        if (checkPrivileged("P")) return <BooksFilterSection />;
        else return <CategoryFilterSection />;
      }
      case "HD": {
        if (checkPrivileged("B")) return <BillFilterSection />;
        else return <CategoryFilterSection />;
      }
      case "TKE": {
        if (checkPrivileged("S")) return <StatisticFilterSection />;
        else return <CategoryFilterSection />;
      }
      case "KH": {
        if (checkPrivileged("W")) return <WarehouseFilterSection />;
        else return <CategoryFilterSection />;
      }
      case "GOP": {
        let account = accountList.filter(
          (item) => item.userName === signInData.user?.userName
        )[0];
        if (
          (account?.privileged.includes("ADM-PR-R") &&
            account?.privileged.includes("ADM-A-R")) ||
          account?.privileged.includes("ADM-R")
        ) {
          if (mergerFilter) return <PrivilegedFilterSection />;
          else return <AccountFilterSection />;
        } else return <CategoryFilterSection />;
      }
      default:
        return <CategoryFilterSection />;
    }
  };

  const addActive = (index) => {
    document.querySelector(".active").classList.remove("active");

    document
      .querySelectorAll(".management-nav-bar")
      [index].classList.add("active");
  };

  return (
    <>
      <div className="management-container">
        <div className="management-left-section">
          <div id="management-left-scroll-section">
            <div className="management-section">
              <div className="management-section-title"> Quản lý </div>
              {managementItems.map((data, index) => {
                if (data.key !== "ERR")
                  return index !== 0 ? (
                    <div
                      key={data.key}
                      className="management-nav-bar"
                      onClick={() => {
                        handleChangeUI(data.key, index);
                      }}
                    >
                      {data.detail}
                    </div>
                  ) : (
                    <div
                      key={data.key}
                      className="management-nav-bar active"
                      onClick={() => {
                        handleChangeUI(data.key, index);
                      }}
                    >
                      {data.detail}
                    </div>
                  );
              })}
            </div>

            <div className="management-search-section">
              <div className="management-section-title">Tìm kiếm</div>

              {handleRenderLeft()}
            </div>
          </div>
        </div>
        <div className="management-right-section">{handleRenderRight()}</div>
      </div>
      {dialog.show ? (
        <div id="confirm-dialog-wrapper">
          <ConfirmDialog />
        </div>
      ) : null}
      <ToastContainer />
    </>
  );
};

export default Management;
