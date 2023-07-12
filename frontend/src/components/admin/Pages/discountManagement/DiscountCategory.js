import { useDispatch, useSelector } from "react-redux";
import discountSlice from "../../../../reducers/componentsReducer/discountMgmt/discountMgmtSlice";

const DiscountCategory = () => {
  const filter = useSelector((state) => state.discountMgmt.filterDisplay);
  const privilegedList = useSelector(
    (state) => state.getPrivileged.privilegedList
  );
  const dispatch = useDispatch();

  return (
    <div
      className="panel-container"
      style={{
        marginTop: 10,
        maxHeight: 300,
        height: 300,
      }}
    >
      <div className="panel-title"> Quản lý khuyến mãi trên thể loại </div>
      <div className="panel-content">
        <div className="panel-btns">
          <div className="panel-btns-action">
            <button
              className="btn btn-green"
              // onClick={() => {
              //   handleFormEdit(2);
              // }}
            >
              Tạo tài khoản
            </button>
            {!filter ? (
              <button
                className="btn btn-red"
                style={{
                  width: "fit-content",
                }}
                onClick={() => {
                  dispatch(discountSlice.actions.setFilterDisplay(true));
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
              // onChange={(e) => handleShowAccountDes(e.target.checked)}
              id="checkedAccountDes"
              // checked={showDes}
            ></input>
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
              {privilegedList.map((item, index) => {
                return (
                  <tr key={item.privilegedID}>
                    <th> {index + 1} </th>
                    <th>{item.privilegedID}</th>
                    <th>{item.detail}</th>
                    <th>{item.createdAt}</th>
                    <th>
                      <button
                        className="btn btn-form-edit"
                        // onClick={() => handleChangeForm(2, {privilegedID: item.privilegedID, detail: item.detail,})}
                      >
                        <i className="fa-solid fa-gear"></i>
                      </button>
                      <button
                        className="btn btn-form-trash"
                        // onClick={() => handleDeletePrivileged(item.privilegedID)}
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

export default DiscountCategory;
