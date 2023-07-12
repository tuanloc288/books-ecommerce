import AccountManagement from "./AccountManagement";
import PrivilegedManagement from "./PrivilegedManagement";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import AccountForm from "./AccountForm";
import { useEffect } from "react";
import accountMgmtSlice from "../../../../reducers/componentsReducer/accountMgmt/accountMgmtSlice";
import privilegedMgmtSlice from "../../../../reducers/componentsReducer/privilegedMgmt/privilegedMgmtSlice";
import PrivilegedForm from "./PrivilegedForm";

const MergeManagement = () => {
  const showFormAcc = useSelector(state => state.accountMgmt.showForm)
  const showFormPri = useSelector(state => state.privilegedMgmt.showForm)
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(accountMgmtSlice.actions.setShowDes(false));
      dispatch(accountMgmtSlice.actions.setForm({type: '' , data: {}, show: false}))
      dispatch(privilegedMgmtSlice.actions.setForm({type: '' , data: {}, show: false}))
    }
  },[])
  
  return (
    <>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {
          !showFormAcc ? <AccountManagement/> : <AccountForm/>
        }
        {
          !showFormPri ? <PrivilegedManagement/> : <PrivilegedForm/>
        }
      </div>
    </>
  );
};

export default MergeManagement;
