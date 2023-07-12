import "./billManagement.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";
import billSlice from "../../../../reducers/componentsReducer/bills/billSlice";
import { billAPI } from "../../../../reducers/apiReducer/billAPI/index";
import { refreshTokenHandler } from "../../../../reducers/apiReducer/signFormAPI/refreshToken";
import getAllBills from "../../../../reducers/apiReducer/billAPI/getAllBills";
import BillForm from "./BillForm";
import { showToastResult, toMoney } from "../../../others/utilsAPI";
import "react-toastify/dist/ReactToastify.css";
import { multipleColor } from "../../others/utils";
import BarChart from "../../charts/BarChart";
import getAllBillDetails, {
  fetchAllBillDetails,
} from "../../../../reducers/apiReducer/billDetailAPI/getAllBillDetails";
import { updateProduct } from "../../../../reducers/apiReducer/productAPI/index";
import getAllProducts from "../../../../reducers/apiReducer/productAPI/getAllProducts";
import { getCurrentDate } from "../../../others/utilsAPI";
import { billDetailAPI } from "../../../../reducers/apiReducer/billDetailAPI";

const BillManagement = () => {
  const action = useSelector((state) => state.bills.action);
  const selectedBill = useSelector((state) => state.bills.selected);
  const billDetailSelected = useSelector(
    (state) => state.getBillDetails.billDetailsList
  );
  const productList = useSelector((state) => state.getProducts.productsList);
  const isLoading = useSelector((state) => state.getBills.isLoading);
  const billList = useSelector((state) => state.getBills.billsList);
  const billRemove = useSelector((state) => state.bills.billsCheckedRemove);
  const filterBills = useSelector((state) => state.bills.filterBills);
  const signInData = useSelector((state) => state.signIn.data);
  const privileged = signInData.user.privileged;
  var billDesFalse = billList.filter((item) => item._destroy !== true);
  const detailList = useSelector((state) => state.getBills.billDetailList);
  const isFilter = useSelector((state) => state.bills.isFilter);
  const isCheckedDesBill = useSelector((state) => state.bills.isCheckedDesBill);
  const [chartData, setChartData] = useState({
    label: [],
    data: [
      {
        quantity: [],
        total: [],
      },
    ],
  });
  const [displayData, setDisplayData] = useState({
    label: [],
    data: {
      quantity: [],
      total: [],
    },
  });

  const [colorList, setColorList] = useState([]);
  const dispatch = useDispatch();

  // start pagination
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  var itemsPerPage = 10;
  var endOffset = null;
  useEffect(() => {
    var endOffset = itemOffset + itemsPerPage;
    setCurrentItems(checkMainArray().slice(itemOffset, endOffset));
    setPageCount(Math.ceil(checkMainArray().length / itemsPerPage));
  }, [itemOffset, itemsPerPage, billList, filterBills, billRemove]);

  useEffect(() => {
    return () => {
      dispatch(billSlice.actions.clearFilterBills())
    }
  },[])

  useEffect(() => {
    if (action === "update") {
      if (Object.keys(selectedBill).length !== 0) {
        if (billDetailSelected.length === 0) {
          fetchData();
        } else {
          for (let i = 0; i < billDetailSelected.length; ++i) {
            var product = getProductByID(billDetailSelected[i].productID);
            updateProduct({
              bookid: product.bookid,
              data: {
                purchased: product.purchased + billDetailSelected[i].quantity,
              },
              accessToken: signInData.accessToken,
            });
            Object.assign(product, {
              purchased: product.purchased + billDetailSelected[i].quantity,
            });
            dispatch(getAllProducts.actions.updateProduct(product));
            dispatch(billSlice.actions.clearAction());
          }
          dispatch(getAllBillDetails.actions.clearBillDetail());
          showToastResult({
            type: "success",
            content: "Xử lý đơn hàng thành công!!!",
          });
        }
      }
    }
  }, [billDetailSelected, selectedBill, action]);

  useEffect(() => {
    if (action === "remove") {
      if (Object.keys(selectedBill).length !== 0) {
        if (billDetailSelected.length === 0) {
          fetchData();
        } else {
          for (let i = 0; i < billDetailSelected.length; ++i) {
            billDetailAPI.deleteBillDetail({
              billDetailID: billDetailSelected[i].billDetailID,
              accessToken: signInData.accessToken,
            });
          }
          dispatch(billSlice.actions.clearAction());
          showToastResult({
            type: "success",
            content: "Xóa đơn hàng khỏi dữ liệu thành công!!!",
          });
        }
      }
    }
  }, [billDetailSelected, selectedBill, action]);

  useEffect(() => {
    if (action === "removeAllChecked") {
      let deleteAll = async () => {
        const newAccess = await refreshTokenHandler(
          signInData.accessToken,
          dispatch
        );
        if (billDetailSelected.length !== 0) {
          for (let i = 0; i < billDetailSelected.length; ++i) {
            dispatch(
              billSlice.actions.removeElementBillsChecked(billRemove[i].billID)
            );
            billDetailAPI.deleteBillDetail({
              billDetailID: billDetailSelected[i].billDetailID,
              accessToken: newAccess,
            });
            dispatch(getAllBillDetails.actions.clearBillDetail());
          }
        } else {
          if (billRemove.length !== 0)
            dispatch(
              fetchAllBillDetails({
                billID: billRemove[0].billID,
                accessToken: newAccess,
              })
            );
          else {
            showToastResult({
              type: "success",
              content: "Xóa đơn hàng khỏi dữ liệu thành công!!!",
            });
            dispatch(billSlice.actions.clearAction());
          }
        }
      };
      deleteAll();
    }
  }, [billRemove, billDetailSelected, action]);

  const fetchData = async () => {
    const newAccess = await refreshTokenHandler(
      signInData.accessToken,
      dispatch
    );
    dispatch(
      fetchAllBillDetails({
        billID: selectedBill.billID,
        accessToken: newAccess,
      })
    );
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % checkMainArray().length;
    setCurrentPage(event.selected);
    setItemOffset(newOffset);
  };
  // end

  // start button billDetail and add bill
  const [form, setForm] = useState(false);

  const handleChangeForm = (bill) => {
    dispatch(billSlice.actions.selectedBill(bill));
    dispatch(billSlice.actions.setAction("view"));
    setForm(!form);
  };
  // end

  const handleSelectedBill = (billTemp) => {
    if (billRemove.length === 0) {
      dispatch(billSlice.actions.setBillsCheckedRemove(billTemp));
    } else {
      var flag = false;
      billRemove.map((bill) => {
        if (billTemp === bill) {
          flag = true;
          dispatch(
            billSlice.actions.removeElementBillsChecked(billTemp.billID)
          );
        }
      });
      if (flag === false) {
        dispatch(billSlice.actions.setBillsCheckedRemove(billTemp));
      }
    }
  };

  function checkMainArray() {
    if (filterBills.length === 0) {
      return billDesFalse;
    } else {
      return filterBills;
    }
  }

  function getProductByID(id) {
    for (let i = 0; i < productList.length; ++i) {
      if (productList[i].bookid === id) {
        return { ...productList[i] };
      }
    }
  }

  const handleSetIsAvailable = async (e) => {
    if (isCheckedDesBill === true) {
      showToastResult({
        type: "error",
        content: "Không thể thực hiện khi đã xóa!!!",
      });
    } else {
      const newAccess = await refreshTokenHandler(
        signInData.accessToken,
        dispatch
      );
      if (privileged.includes("ADM-U") || privileged.includes("ADM-B-UD")) {
        const parentClassName = e.target.parentElement.className;
        const parentEle = e.target.parentElement;
        const childEle = e.target;
        if (parentClassName === "btn-change-status-true") {
          showToastResult({
            type: "error",
            content: "Không thể thực hiện khi đã xử lý!!!",
          });
        } else {
          childEle.style.animationName = "leftToRight";
          childEle.style.animationDuration = "0.5s";
          childEle.style.animationFillMode = "forwards";
          parentEle.style.backgroundColor = "var(--letter-color)";

          parentEle.classList.remove("btn-change-status-false");
          parentEle.classList.add("btn-change-status-true");
          childEle.classList.remove("btn-change-status-false-circle");
          childEle.classList.add("btn-change-status-true-circle");

          const billID = e.target.attributes.value.value;
          var bill = billList.filter((bill) => {
            if (bill.billID === billID) {
              return bill;
            }
          });
          // xử lý bill
          bill = { ...bill[0] };
          const status = bill.status === "Đã xử lý" ? "Chưa xử lý" : "Đã xử lý";
          Object.assign(bill, { status: status, handleDate: getCurrentDate() });
          billAPI.updateBill({
            billID: bill.billID,
            data: { status: status, handleDate: getCurrentDate() },
            accessToken: newAccess,
          });
          dispatch(getAllBills.actions.updateBill(bill));
          // xử lý cập nhật lại purchased của sản phẩm
          dispatch(billSlice.actions.selectedBill(bill));
          dispatch(billSlice.actions.setAction("update"));
        }
      } else {
        showToastResult({
          type: "error",
          content: "Bạn không có quyền thực hiện hành động này!!!",
        });
      }
    }
  };

  const handleRemoveBill = async (billTemp) => {
    if (privileged.includes("ADM-D") || privileged.includes("ADM-B-UD")) {
      const newAccess = await refreshTokenHandler(
        signInData.accessToken,
        dispatch
      );
      if (billTemp._destroy === false) {
        let text = "Bạn muốn xóa tạm hóa đơn này\nEither OK or Cancel.";
        if (window.confirm(text) === true) {
          //for ui
          if (checkMainArray() === filterBills) {
            dispatch(
              billSlice.actions.removeElementFilterBills(billTemp.billID)
            );
          } else {
            billDesFalse = billDesFalse.filter(
              (item) => item.billID !== billTemp.billID
            );
          }
          //for database
          billTemp = { ...billTemp };
          const destroy = !billTemp._destroy;
          Object.assign(billTemp, { _destroy: destroy });
          dispatch(getAllBills.actions.updateBill(billTemp));
          billAPI.updateBill({
            billID: billTemp.billID,
            data: { _destroy: destroy },
            accessToken: newAccess,
          });
          showToastResult({
            type: "success",
            content: "Xóa tạm thành công!!!",
          });
        }
      } else {
        if (privileged.includes("ADM-D")) {
          let text = "Bạn muốn xóa vĩnh viễn hóa đơn này\nEither OK or Cancel.";
          if (window.confirm(text) === true) {
            if (checkMainArray() === filterBills) {
              dispatch(
                billSlice.actions.removeElementFilterBills(billTemp.billID)
              );
            }
            dispatch(getAllBills.actions.removeBill(billTemp.billID));
            dispatch(billSlice.actions.selectedBill(billTemp));
            billAPI.deleteBill({
              billID: billTemp.billID,
              accessToken: newAccess,
            });
            dispatch(billSlice.actions.setAction("remove"));
          }
        } else {
          showToastResult({
            type: "error",
            content: "Bạn không có quyền thực hiện hành động này!!!",
          });
        }
      }
    } else {
      showToastResult({
        type: "error",
        content: "Bạn không có quyền thực hiện hành động này!!!",
      });
    }
  };

  const handleShowBillDes = () => {
    const checked = document.getElementById("checkedBillDes").checked;
    if (checked === true) {
      dispatch(billSlice.actions.setFilterByBillDestroy(billList));
    } else {
      dispatch(billSlice.actions.clearFilterBills());
      dispatch(billSlice.actions.setFilterBills(billDesFalse));
    }
    dispatch(billSlice.actions.clearBillsCheckedRemove());
  };

  const handleDeleteAllChecked = async () => {
    if (privileged.includes("ADM-D") || privileged.includes("ADM-B-UD")) {
      const newAccess = await refreshTokenHandler(
        signInData.accessToken,
        dispatch
      );
      if (billRemove[0]._destroy === false) {
        let text = "Bạn muốn xóa tạm những hóa đơn này\nEither OK or Cancel.";
        if (window.confirm(text) === true) {
          for (let i = 0; i < billRemove.length; ++i) {
            if (checkMainArray() === filterBills) {
              dispatch(
                billSlice.actions.removeElementFilterBills(billRemove[i].billID)
              );
            }
            var billTemp = { ...billRemove[i] };
            const destroy = !billTemp._destroy;
            Object.assign(billTemp, { _destroy: destroy });
            billAPI.updateBill({
              billID: billTemp.billID,
              data: { _destroy: billTemp._destroy },
              accessToken: newAccess,
            });
            dispatch(getAllBills.actions.updateBill(billTemp));
            dispatch(billSlice.actions.clearBillsCheckedRemove());
          }
          showToastResult({
            type: "success",
            content: "Xóa tạm thành công!!!",
          });
        }
      } else {
        let text =
          "Bạn muốn xóa vĩnh viễn những hóa đơn này\nEither OK or Cancel.";
        if (window.confirm(text) === true) {
          for (let i = 0; i < billRemove.length; ++i) {
            if (checkMainArray() === filterBills) {
              dispatch(
                billSlice.actions.removeElementFilterBills(billRemove[i].billID)
              );
            }
            await billAPI.deleteBill({
              billID: billRemove[i].billID,
              accessToken: newAccess,
            });
            dispatch(getAllBills.actions.removeBill(billRemove[i].billID));
            dispatch(billSlice.actions.setAction("removeAllChecked"));
          }
        }
      }
    }
  };

  const handleReverseBill = async (billTemp) => {
    if (privileged.includes("ADM-U") || privileged.includes("ADM-B-UD")) {
      const newAccess = await refreshTokenHandler(
        signInData.accessToken,
        dispatch
      );
      let text =
        "Do you want to reverse this bill to trash\nEither OK or Cancel.";
      if (window.confirm(text) === true) {
        //for ui
        if (checkMainArray() === filterBills) {
          dispatch(billSlice.actions.removeElementFilterBills(billTemp.billID));
        } else {
          billDesFalse = billDesFalse.filter(
            (item) => item.billID !== billTemp.billID
          );
        }
        //for database
        billTemp = { ...billTemp };
        const destroy = !billTemp._destroy;
        Object.assign(billTemp, { _destroy: destroy });
        billAPI.updateBill({
          billID: billTemp.billID,
          data: { _destroy: destroy },
          accessToken: newAccess,
        });
        dispatch(getAllBills.actions.updateBill(billTemp));
        showToastResult({
          type: "success",
          content: "Lấy lại bill thành công!!!",
        });
      }
    } else {
      showToastResult({
        type: "error",
        content: "Bạn không có quyền thực hiện hành động này!!!",
      });
    }
  };

  useEffect(() => {
    if (Object.keys(detailList).length !== 0) {
      // set quantity and total per account
      let accountList = [];
      for (let y in billList) {
        if (!Object.keys(accountList).includes(billList[y].userName)) {
          accountList[billList[y].userName] = {
            quantity: 0,
            total: 0,
          };
        }
        for (let index in detailList[billList[y].billID]) {
          accountList[billList[y].userName] = {
            quantity:
              accountList[billList[y].userName].quantity +
              detailList[billList[y].billID][index].quantity,
            total:
              accountList[billList[y].userName].total +
              (detailList[billList[y].billID][index].totalAmount -
                detailList[billList[y].billID][index].totalAmount *
                  detailList[billList[y].billID][index].discount),
          };
        }
      }
      let tempLabel = [];
      let displayLabel = [];
      let tempList = {
        quantity: [],
        total: [],
      };
      let count = 0;
      for (let key in accountList) {
        if (count === 1) {
          tempList.quantity.push(accountList[key].quantity);
          tempList.total.push(accountList[key].total);
          if (!displayLabel.includes(key.split("@")[0]))
            displayLabel.push(key.split("@")[0]);
          setDisplayData({
            label: displayLabel,
            data: tempList,
          });
          count++;
        } else if (count < 1) {
          tempList.quantity.push(accountList[key].quantity);
          tempList.total.push(accountList[key].total);
          if (!displayLabel.includes(key.split("@")[0]))
            displayLabel.push(key.split("@")[0]);
          count++;
        }
        if (!tempLabel.includes(key)) {
          tempLabel.push(key);
        }
      }
      setChartData({
        label: tempLabel,
        data: accountList,
      });
      setColorList(multipleColor(tempLabel.length));
      if (document.getElementById("list-one")) {
        document.getElementById("list-one").value = tempLabel[0];
        document.getElementById("list-two").value = tempLabel[1];
      }
    }
  }, [billList]);

  const handleList = (list, id) => {
    let tempList = {
      quantity: [],
      total: [],
    };
    let tempLabel = [];
    for (let i in chartData.data) {
      if (i === id) {
        tempLabel.push(i.split("@")[0]);
        tempList.quantity.push(chartData.data[i].quantity);
        tempList.total.push(chartData.data[i].total);
        break;
      }
    }
    for (let i in chartData.data) {
      if (
        i ===
        document.getElementById(`list-${list === 1 ? "two" : "one"}`).value
      ) {
        tempLabel.push(i.split("@")[0]);
        tempList.quantity.push(chartData.data[i].quantity);
        tempList.total.push(chartData.data[i].total);
        break;
      }
    }
    setDisplayData({
      label: tempLabel,
      data: tempList,
    });
    setColorList(multipleColor(tempLabel.length));
  };

  return (
    <>
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <>
          {form === false ? (
            <div className="panel-container">
              <div className="panel-title"> Quản lý hóa đơn </div>
              <div className="panel-content">
                <div className="panel-btns">
                  <div className="panel-btns-action">
                    <button
                      className="btn btn-red"
                      onClick={handleDeleteAllChecked}
                    >
                      Xóa hóa đơn
                    </button>
                  </div>
                  <div className="panel-btns-checkbox">
                    <label> Các hóa đơn bị tạm xóa </label>
                    {isCheckedDesBill === true ? (
                      <input
                        type={"checkbox"}
                        checked
                        onClick={handleShowBillDes}
                        id="checkedBillDes"
                      ></input>
                    ) : (
                      <input
                        type={"checkbox"}
                        onClick={handleShowBillDes}
                        id="checkedBillDes"
                      ></input>
                    )}
                  </div>
                </div>
                <div className="panel-table">
                  <table>
                    <thead>
                      <tr>
                        <th> </th>
                        <th> No </th>
                        <th> Mã hóa đơn </th>
                        <th> Tài khoản </th>
                        <th> Trạng thái </th>
                        <th> Ngày đặt hàng </th>
                        <th> Ngày xử lý </th>
                        <th> Tổng cộng </th>
                        <th> Hành động </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems === null ? (
                        setCurrentItems(
                          filterBills.length === 0
                            ? billDesFalse.slice(itemOffset, endOffset)
                            : filterBills.slice(itemOffset, endOffset)
                        )
                      ) : filterBills.length === 0 && isFilter === true ? (
                        <tr>
                          <th colSpan={8}>
                            <div className="no-data">
                              (Không tìm thấy theo bộ lọc)
                            </div>
                          </th>
                        </tr>
                      ) : (
                        currentItems
                          .map((item, index) => {
                            return (
                              <tr key={item.billID}>
                                <th>
                                  <input
                                    type={"checkbox"}
                                    value={item.billID}
                                    onClick={() => handleSelectedBill(item)}
                                  />
                                </th>
                                <th>
                                  {index + 1 + currentPage * itemsPerPage}
                                </th>
                                <th>{item.billID}</th>
                                <th>{item.userName}</th>
                                <th>
                                  {item.status === "Đã xử lý" ? (
                                    <div className="btn-change-status-true">
                                      <div
                                        className="btn-change-status-true-circle"
                                        onClick={handleSetIsAvailable}
                                        value={item.billID}
                                      ></div>
                                    </div>
                                  ) : (
                                    <div className="btn-change-status-false">
                                      <div
                                        className="btn-change-status-false-circle"
                                        onClick={handleSetIsAvailable}
                                        value={item.billID}
                                      ></div>
                                    </div>
                                  )}
                                </th>
                                <th>{item.orderDate}</th>
                                <th>{item.handleDate}</th>
                                <th>{toMoney(item.totalAmount)}đ</th>
                                <th>
                                  <button
                                    className="btn btn-form-edit"
                                    onClick={() => handleChangeForm(item)}
                                  >
                                    <i className="fa-sharp fa-solid fa-eye"></i>
                                  </button>
                                  {isCheckedDesBill === true ? (
                                    <button
                                      className="btn btn-form-reverse"
                                      onClick={() => handleReverseBill(item)}
                                    >
                                      <i className="fa-sharp fa-solid fa-rotate-left"></i>
                                    </button>
                                  ) : (
                                    <></>
                                  )}
                                  <button
                                    className="btn btn-form-trash"
                                    onClick={() => handleRemoveBill(item)}
                                  >
                                    <i className="fa-solid fa-trash"></i>
                                  </button>
                                </th>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                  {filterBills.length === 0 && isFilter === true ? (
                    <></>
                  ) : (
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel=">"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={pageCount}
                      previousLabel="<"
                      renderOnZeroPageCount={null}
                      containerClassName="react-pagination"
                      pageLinkClassName="react-page-num"
                      previousLinkClassName="react-page-num"
                      nextLinkClassName="react-page-num"
                      activeLinkClassName="react-page-active"
                    />
                  )}
                  {isCheckedDesBill === true ? (
                    <></>
                  ) : (
                    <div
                      className="panel-statistic"
                      style={{
                        margin: "10px 20px",
                      }}
                    >
                      <span> Chọn ra 2 tài khoản để thống kê: </span>
                      <select
                        style={{
                          margin: "10px",
                        }}
                        id="list-one"
                        onChange={(e) => handleList(1, e.target.value)}
                      >
                        {chartData.label.length !== 0
                          ? chartData.label.map((item, index) => {
                              return (
                                <option key={index} value={item}>
                                  {" "}
                                  {item}{" "}
                                </option>
                              );
                            })
                          : null}
                      </select>
                      <select
                        style={{
                          marginLeft: 10,
                        }}
                        id="list-two"
                        onChange={(e) => handleList(2, e.target.value)}
                      >
                        {chartData.label.length !== 0
                          ? chartData.label.map((item, index) => {
                              return (
                                <option key={index} value={item}>
                                  {" "}
                                  {item}{" "}
                                </option>
                              );
                            })
                          : null}
                      </select>
                      <div id="category-mgmt-chart-section">
                        <BarChart
                          title={"Tổng số tiền đã chi"}
                          label={
                            displayData.label.length !== 0
                              ? displayData.label
                              : []
                          }
                          data={
                            displayData.data.total.length !== 0
                              ? displayData.data.total
                              : []
                          }
                          about={""}
                          showLegend={false}
                          color={colorList}
                        />
                        <BarChart
                          title={"Tổng số sản phẩm đã mua"}
                          label={
                            displayData.label.length !== 0
                              ? displayData.label
                              : []
                          }
                          data={
                            displayData.data.quantity.length !== 0
                              ? displayData.data.quantity
                              : []
                          }
                          about={""}
                          showLegend={false}
                          color={colorList}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <BillForm />
          )}
        </>
      )}
    </>
  );
};

export default BillManagement;
