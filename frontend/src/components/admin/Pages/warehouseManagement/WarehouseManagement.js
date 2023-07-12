import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import warehouseSlice from "../../../../reducers/componentsReducer/warehouses/warehouseSlice";
import {
  deleteWarehouse,
  updateWarehouse,
} from "../../../../reducers/apiReducer/warehouseAPI/index";
import { refreshTokenHandler } from "../../../../reducers/apiReducer/signFormAPI/refreshToken";
import getAllWarehouses from "../../../../reducers/apiReducer/warehouseAPI/getAllWarehouses";
import WarehouseForm from "./WarehouseForm";
import { showToastResult } from "../../../others/utilsAPI";
import { toMoney } from "../../../others/utilsAPI";
import "react-toastify/dist/ReactToastify.css";
import getWarehouseDetail, {
  fetchAllWarehouseDetails,
} from "../../../../reducers/apiReducer/warehouseDetailAPI/getWarehouseDetail";
import { deleteWhDetail } from "../../../../reducers/apiReducer/warehouseDetailAPI/index";

const WarehouseManagement = () => {
  const isLoading = useSelector((state) => state.getWarehouses.isLoading);
  const warehouseList = useSelector(
    (state) => state.getWarehouses.warehousesList
  );
  var warehouseDesFalse = warehouseList.filter(
    (item) => item._destroy !== true
  );
  const warehouseRemove = useSelector(
    (state) => state.warehouses.warehousesCheckedRemove
  );
  const filterWarehouses = useSelector(
    (state) => state.warehouses.filterWarehouses
  );
  const isCheckedDesWarehosue = useSelector(
    (state) => state.warehouses.isCheckedDesWarehosue
  );
  const action = useSelector((state) => state.warehouses.action);
  const signInData = useSelector((state) => state.signIn.data);
  const isFilter = useSelector((state) => state.warehouses.isFilter);
  const selectedWarehouse = useSelector((state) => state.warehouses.selected);
  const whDetailList = useSelector(
    (state) => state.getWhDetail.warehouseDetailsList
  );
  const privileged = signInData.user.privileged;

  const dispatch = useDispatch();
  // var warehouseDesFalse = warehouseList.length === 0 ? 0 : warehouseList.filter(item => item._destroy !== true);

    useEffect(() => {
      return () => {
        dispatch(warehouseSlice.actions.clearFilterWarehouses())
      }
    },[])

  // start pagination
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  var itemsPerPage = 16;
  var endOffset = null;
  useEffect(() => {
    var endOffset = itemOffset + itemsPerPage;
    setCurrentItems(checkMainArray().slice(itemOffset, endOffset));
    setPageCount(Math.ceil(checkMainArray().length / itemsPerPage));
  }, [
    itemOffset,
    itemsPerPage,
    warehouseList,
    filterWarehouses,
    warehouseRemove,
    dispatch,
  ]);

  const fetchData = async () => {
    const newAccess = await refreshTokenHandler(
      signInData.accessToken,
      dispatch
    );
    dispatch(
      fetchAllWarehouseDetails({
        importNoteID: selectedWarehouse.importNoteID,
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

  // start button warehouseDetail and add warehouse
  const [form, setForm] = useState(false);

  const handleChangeForm = async (props) => {
    if (props.content === "view") {
      let fetch = async () => {
        const newAccess = await refreshTokenHandler(
          signInData.accessToken,
          dispatch
        );
        dispatch(
          fetchAllWarehouseDetails({
            importNoteID: props.data.importNoteID,
            accessToken: newAccess,
          })
        );
      };
      await fetch();
      dispatch(warehouseSlice.actions.selectedWarehouse(props.data));
      setForm(!form);
    } else {
      if (privileged.includes("ADM-C") || privileged.includes("ADM-W-CUD")) {
        dispatch(warehouseSlice.actions.selectedWarehouse(props.data));
        setForm(!form);
      } else {
        showToastResult({
          type: "error",
          content: "Bạn không có quyền thực hiện hành động này!!!",
        });
      }
    }
  };
  // end

  useEffect(() => {
    if (action === "remove") {
      if (Object.keys(selectedWarehouse).length !== 0) {
        if (whDetailList.length === 0) {
          fetchData();
        } else {
          for (let i = 0; i < whDetailList.length; ++i) {
            deleteWhDetail({
              importNoteDetailID: whDetailList[i].importNoteDetailID,
              accessToken: signInData.accessToken,
            });
          }
          dispatch(warehouseSlice.actions.clearAction());
          showToastResult({
            type: "success",
            content: "Xóa phiếu nhập khỏi dữ liệu thành công!!!",
          });
        }
      }
    }
  }, [whDetailList, selectedWarehouse, action]);

  useEffect(() => {
    if (action === "removeAllChecked") {
      let deleteAll = async () => {
        const newAccess = await refreshTokenHandler(
          signInData.accessToken,
          dispatch
        );
        if (whDetailList.length !== 0) {
          for (let i = 0; i < whDetailList.length; ++i) {
            deleteWhDetail({
              importNoteID: whDetailList[i].importNoteID,
              accessToken: newAccess,
            });
          }
          dispatch(getWarehouseDetail.actions.clearWarehouseDetail());
          dispatch(
            warehouseSlice.actions.removeElementWarehousesChecked(
              warehouseRemove[0].importNoteID
            )
          );
        } else {
          if (warehouseRemove.length !== 0)
            dispatch(
              fetchAllWarehouseDetails({
                importNoteID: warehouseRemove[0].importNoteID,
                accessToken: newAccess,
              })
            );
          else {
            dispatch(warehouseSlice.actions.clearActionUpdate());
            showToastResult({
              type: "success",
              content: "Xóa đơn hàng khỏi dữ liệu thành công!!!",
            });
          }
        }
      };
      deleteAll();
    }
  }, [whDetailList, action, warehouseRemove]);

  const handleSelectedWarehouse = (warehouseTemp) => {
    if (warehouseRemove.length === 0) {
      dispatch(
        warehouseSlice.actions.setWarehousesCheckedRemove(warehouseTemp)
      );
    } else {
      var flag = false;
      warehouseRemove.map((warehouse) => {
        if (warehouseTemp === warehouse) {
          flag = true;
          dispatch(
            warehouseSlice.actions.removeElementWarehousesChecked(
              warehouseTemp.importNoteID
            )
          );
        }
      });
      if (flag === false) {
        dispatch(
          warehouseSlice.actions.setWarehousesCheckedRemove(warehouseTemp)
        );
      }
    }
  };

  function checkMainArray() {
    if (filterWarehouses.length === 0) {
      return warehouseDesFalse;
    } else {
      return filterWarehouses;
    }
  }

  const handleRemoveWarehouse = async (warehouseTemp) => {
    if (privileged.includes("ADM-U") || privileged.includes('ADM-D') || privileged.includes('ADM-W-CUD')) {
      const newAccess = await refreshTokenHandler(
        signInData.accessToken,
        dispatch
      );
      if (warehouseTemp._destroy === false) {
        let text = "Bạn có muốn xóa tạm phiếu nhập này\nEither OK or Cancel.";
        if (window.confirm(text) === true) {
          //for ui
          if (checkMainArray() === filterWarehouses) {
            dispatch(
              warehouseSlice.actions.removeElementFilterWarehouses(
                warehouseTemp.importNoteID
              )
            );
          } else {
            warehouseDesFalse = warehouseDesFalse.filter(
              (item) => item.importNoteID !== warehouseTemp.importNoteID
            );
          }
          //for database
          warehouseTemp = { ...warehouseTemp };
          const destroy = !warehouseTemp._destroy;
          Object.assign(warehouseTemp, { _destroy: destroy });
          updateWarehouse({
            importNoteID: warehouseTemp.importNoteID,
            data: { _destroy: destroy },
            accessToken: newAccess,
          });
          dispatch(getAllWarehouses.actions.updateWarehouse(warehouseTemp));
          showToastResult({
            type: "success",
            content: "Xóa tạm thành công!!!",
          });
        }
      } else {
        if (privileged.includes("ADM-D")) {
          let text =
            "Bạn muốn xóa vĩnh viễn phiếu nhập này\nEither OK or Cancel.";
          if (window.confirm(text) === true) {
            if (checkMainArray() === filterWarehouses) {
              dispatch(
                warehouseSlice.actions.removeElementFilterWarehouses(
                  warehouseTemp.importNoteID
                )
              );
            }
            deleteWarehouse({
              importNoteID: warehouseTemp.importNoteID,
              accessToken: newAccess,
            });
            dispatch(
              getAllWarehouses.actions.removeWarehouse(
                warehouseTemp.importNoteID
              )
            );
            dispatch(warehouseSlice.actions.selectedWarehouse(warehouseTemp));
            dispatch(warehouseSlice.actions.setAction("remove"));
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

  const handleShowWarehouseDes = () => {
    const checked = document.getElementById("checkedWarehouseDes").checked;
    if (checked === true) {
      dispatch(
        warehouseSlice.actions.setFilterByWarehouseDestroy(warehouseList)
      );
    } else {
      dispatch(warehouseSlice.actions.clearFilterWarehouses());
      dispatch(warehouseSlice.actions.setFilterWarehouses(warehouseDesFalse));
    }
  };

  const handleDeleteAllChecked = async () => {
    if (privileged.includes("ADM-D") || privileged.includes("ADM-W-CUD")) {
      const newAccess = await refreshTokenHandler(
        signInData.accessToken,
        dispatch
      );
      if (warehouseRemove[0]._destroy === false) {
        let text =
          "Bạn muốn xóa tạm những phiếu nhập này\nEither OK or Cancel.";
        if (window.confirm(text) === true) {
          for (let i = 0; i < warehouseRemove.length; ++i) {
            if (checkMainArray() === filterWarehouses) {
              dispatch(
                warehouseSlice.actions.removeElementFilterWarehouses(
                  warehouseRemove[i].importNoteID
                )
              );
            }
            var warehouseTemp = { ...warehouseRemove[i] };
            const destroy = !warehouseTemp._destroy;
            Object.assign(warehouseTemp, { _destroy: destroy });
            updateWarehouse({
              importNoteID: warehouseTemp.importNoteID,
              data: { _destroy: warehouseTemp._destroy },
              accessToken: newAccess,
            });
            dispatch(
              getAllWarehouses.actions.removeWarehouse(
                warehouseTemp.importNoteID
              )
            );
            dispatch(warehouseSlice.actions.clearWarehousesCheckedRemove());
          }
          showToastResult({
            type: "success",
            content: "Xóa tạm thành công!!!",
          });
        }
      } else {
        let text =
          "Bạn muốn xóa vĩnh viễn những phiếu nhập này\nEither OK or Cancel.";
        if (window.confirm(text) === true) {
          for (let i = 0; i < warehouseRemove.length; ++i) {
            if (checkMainArray() === filterWarehouses) {
              dispatch(
                warehouseSlice.actions.removeElementFilterWarehouses(
                  warehouseRemove[i].importNoteID
                )
              );
            }
            await deleteWarehouse({
              importNoteID: warehouseRemove[i].importNoteID,
              accessToken: newAccess,
            });
            dispatch(
              getAllWarehouses.actions.removeWarehouse(
                warehouseRemove[i].importNoteID
              )
            );
            dispatch(warehouseSlice.actions.setAction("removeAllChecked"));
          }
        }
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <>
          {form === false ? (
            <div className="panel-container">
              <div className="panel-title"> Quản lý nhập kho </div>
              <div className="panel-content">
                <div className="panel-btns">
                  <div className="panel-btns-action">
                    <button
                      className="btn btn-green"
                      onClick={() =>
                        handleChangeForm({ data: {}, content: "create" })
                      }
                    >
                      Nhập
                    </button>
                    <button
                      className="btn btn-red"
                      onClick={handleDeleteAllChecked}
                    >
                      Xóa
                    </button>
                  </div>
                  <div className="panel-btns-checkbox">
                    <span> Các phiếu nhập bị tạm xóa </span>
                    {isCheckedDesWarehosue === true ? (
                      <input
                        type={"checkbox"}
                        checked
                        onClick={handleShowWarehouseDes}
                        id="checkedWarehouseDes"
                      ></input>
                    ) : (
                      <input
                        type={"checkbox"}
                        onClick={handleShowWarehouseDes}
                        id="checkedWarehouseDes"
                      ></input>
                    )}
                  </div>
                </div>
                <div className="panel-table">
                  <table>
                    <thead>
                      <tr>
                        <th> </th>
                        <th> STT </th>
                        <th> Mã nhập kho </th>
                        <th> Tổng sản phẩm </th>
                        <th> Tổng tiền </th>
                        <th> Tài khoản </th>
                        <th> Ngày tạo </th>
                        <th> Hành động </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        warehouseList.length === 0 ? (
                          <tr>
                            <th colSpan={8}>
                              <div className="no-data">(Chưa có dữ liệu)</div>
                            </th>
                          </tr>
                        ) : currentItems === null ? (
                          setCurrentItems(
                            filterWarehouses.length === 0
                              ? warehouseDesFalse.slice(itemOffset, endOffset)
                              : filterWarehouses.slice(itemOffset, endOffset)
                          )
                        ) : filterWarehouses.length === 0 &&
                          isFilter === true ? (
                          <tr>
                            <th colSpan={8}>
                              <div className="no-data">
                                (Không tìm thấy theo bộ lọc)
                              </div>
                            </th>
                          </tr>
                        ) : (
                          currentItems.map((item, index) => {
                              return (
                                <tr key={item.importNoteID}>
                                  <th>
                                    <input
                                      type={"checkbox"}
                                      value={item.importNoteID}
                                      onClick={() =>
                                        handleSelectedWarehouse(item)
                                      }
                                    />
                                  </th>
                                  <th>
                                    {index + 1 + currentPage * itemsPerPage}
                                  </th>
                                  <th>{item.importNoteID}</th>
                                  <th>{item.totalItems}</th>
                                  <th>{toMoney(item.totalAmount)}đ</th>
                                  <th>{item.userName}</th>
                                  <th>{item.createdAt}</th>
                                  <th>
                                    <button
                                      className="btn btn-form-edit"
                                      onClick={() =>
                                        handleChangeForm({
                                          data: item,
                                          content: "view",
                                        })
                                      }
                                    >
                                      <i className="fa-sharp fa-solid fa-eye"></i>
                                    </button>
                                    <button
                                      className="btn btn-form-trash"
                                      onClick={() =>
                                        handleRemoveWarehouse(item)
                                      }
                                    >
                                      <i className="fa-solid fa-trash"></i>
                                    </button>
                                  </th>
                                </tr>
                              );
                            })
                        )
                        // )
                      }
                    </tbody>
                  </table>
                </div>
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
              </div>
            </div>
          ) : (
            <WarehouseForm />
          )}
        </>
      )}
    </>
  );
};

export default WarehouseManagement;
