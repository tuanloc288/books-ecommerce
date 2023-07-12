import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import discountAccountMgmt from "../../../../reducers/componentsReducer/discountMgmt/discountAccountSlice";
import { discountAccountAPI } from "../../../../reducers/apiReducer/discountOnAccountAPI/index";
import { refreshTokenHandler } from "../../../../reducers/apiReducer/signFormAPI/refreshToken";
import { getCurrentDate } from "../../others/utils";
import getAllDoA from "../../../../reducers/apiReducer/discountOnAccountAPI/getAllDoA";

const DiscountAccountForm = () => {
  const formData = useSelector((state) => state.discountAccountMgmt.formData);
  const formType = useSelector((state) => state.discountAccountMgmt.formType);
  const DoAList = useSelector((state) => state.getAllDoA.DoAList);
  const accountList = useSelector((state) => state.getAccounts.accountsList);
  const signInData = useSelector((state) => state.signIn.data);

  const [data, setData] = useState({
    id:
      Object.keys(formData).length !== 0
        ? formData.DoAID
        : DoAList.length !== 0
        ? `DoA${
            parseInt(DoAList[DoAList.length - 1].DoAID.split("DoA")[1]) + 1
          }`
        : "DoA01",
    user: accountList[0].userName,
    detail: 5,
    duration: 1,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (accountList.length !== 0) {
      setData(() => ({
        ...data,
        user: accountList[0].userName,
      }));
    }
  }, [accountList]);

  const handleConfirm = async () => {
    if (data.detail > 15 || data.detail < 5) {
      toast.error("Phần trăm khuyến mãi không hợp lệ!", {
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
    } else if (data.duration > 10 || data.duration < 1) {
      toast.error("Số ngày khuyến mãi không hợp lệ!", {
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
      let d = new Date();
      d.setDate(d.getDate() + parseInt(data.duration));
      let newToken = await refreshTokenHandler(signInData.accessToken);
      discountAccountAPI.createDoA({
        accessToken: newToken,
        data: {
          DoAID: data.id,
          userName: data.user,
          detail: data.detail / 100,
          duration: d,
        },
      });
      dispatch(
        getAllDoA.actions.addDoA({
          DoAID: data.id,
          userName: data.user,
          detail: data.detail / 100,
          createdAt: getCurrentDate(),
          duration: d
        })
      );
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
      <div
        className="panel-form-form"
        style={{
          height: "100%",
        }}
      >
        <div className="panel-title"> {formType} trên tài khoản </div>
        <div className="discount-form-container">
          <div className="discount-form-column">
            <div className="discount-form-label"> Mã khuyến mãi </div>
            <input
              className="discount-form-input"
              disabled
              defaultValue={data.id}
            />
            <div className="discount-form-label">
              Chọn tài khoản được áp dụng khuyến mãi
            </div>
            <select
              name="user"
              value={data.user}
              style={{
                padding: 5,
                fontSize: 18,
              }}
              onChange={(e) => {
                setData(() => ({
                  ...data,
                  [e.target.name]: e.target.value,
                }));
              }}
            >
              {accountList.map((item) => {
                return (
                  <option key={item.userName} value={item.userName}>
                    {item.userName}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="discount-form-column">
            <div className="discount-form-label">
              Phần trăm khuyến mãi tối đa 15%, tối thiểu 5%
            </div>
            <input
              className="input-number-arrow"
              type="number"
              name="detail"
              value={data.detail}
              min={5}
              max={15}
              onChange={(e) => {
                setData(() => ({
                  ...data,
                  [e.target.name]: e.target.value,
                }));
              }}
            />
            <div className="discount-form-label">
              Số ngày áp dụng tính từ hiện tại tối đa 10 ngày, tối thiểu 1 ngày
            </div>
            <input
              className="input-number-arrow"
              type="number"
              name="duration"
              value={data.duration}
              min={1}
              max={10}
              onChange={(e) => {
                setData(() => ({
                  ...data,
                  [e.target.name]: e.target.value,
                }));
              }}
            />
          </div>
          <div className="discount-form-btn-section">
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
                  discountAccountMgmt.actions.setForm({
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

export default DiscountAccountForm;
