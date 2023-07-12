import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import discountAccountMgmt from "../../../../reducers/componentsReducer/discountMgmt/discountAccountSlice";
import discountSlice from "../../../../reducers/componentsReducer/discountMgmt/discountMgmtSlice";

const DiscountAccount = () => {
  const filter = useSelector((state) => state.discountMgmt.filterDisplay);
  const DoAList = useSelector((state) => state.getAllDoA.DoAList);
  const signInData = useSelector((state) => state.signIn.data);
  const accountList = useSelector((state) => state.getAccounts.accountsList);

  const dispatch = useDispatch();

  const checkRight = (type) => {
    let account = accountList.filter(item => item.userName === signInData.user.userName)[0]
    return (
      !account.privileged.includes(`ADM-D-${type}`) &&
      !account.privileged.includes(`ADM-${type}`)
    );
  };

  const handleFormEdit = (type, item) => {
    if(type === 2){
      if (checkRight("C")) {
        toast.error("Bạn không có quyền tạo khuyến mãi!", {
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
          discountAccountMgmt.actions.setForm({
            type: "Thêm khuyến mãi",
            data: {},
            show: true,
          })
        );
      }
    }
    else {
      if (checkRight("U")) {
        toast.error("Bạn không có quyền chỉnh sửa khuyến mãi!", {
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
          discountAccountMgmt.actions.setForm({
            type: "Chỉnh sửa khuyến mãi",
            data: item,
            show: true,
          })
        );
      }
    }
  }

  return (
    <div
      className="panel-container"
      style={{
        marginTop: 10,
        maxHeight: 300,
        height: 300,
      }}
    >
      <div className="panel-title"> Quản lý khuyến mãi trên tài khoản </div>
      <div className="panel-content">
        <div className="panel-btns">
          <div className="panel-btns-action">
            <button
              className="btn btn-green"
              onClick={() => {
                handleFormEdit(2);
              }}
            >
              Tạo khuyến mãi
            </button>
            {filter ? (
              <button
                className="btn btn-red"
                style={{
                  width: "fit-content",
                }}
                onClick={() => {
                  dispatch(discountSlice.actions.setFilterDisplay(false));
                }}
              >
                Chuyển tìm kiếm
              </button>
            ) : null}
          </div>
          <div className="panel-btns-checkbox">
            <label> Các chương trình khuyến mãi hết hạn </label>
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
                <th> Mã khuyến mãi </th>
                <th> Tài khoản áp dụng </th>
                <th> Chi tiết </th>
                <th> Ngày bắt đầu </th>
                <th> Ngày kết thúc </th>
                <th> Hành động </th>
              </tr>
            </thead>
            <tbody>
              {DoAList.length !== 0 ? (
                DoAList.map((item, index) => {
                  return (
                    <tr key={item.DoAID}>
                      <th> {index + 1} </th>
                      <th>{item.DoAID}</th>
                      <th>{item.userName}</th>
                      <th>{item.detail}</th>
                      <th>{item.createdAt}</th>
                      <th>{item.duration}</th>
                      <th>
                        <button
                          className="btn btn-form-edit"
                          onClick={() => handleFormEdit(1, {DoAID: item.DoAID, detail: item.detail, duration: item.duration})}
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
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      fontSize: "var(--header-font-size)",
                      fontFamily: "var(--header-font)",
                    }}
                  >
                    Hiện chưa có chương trình khuyến mãi dành cho tài khoản
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DiscountAccount;
