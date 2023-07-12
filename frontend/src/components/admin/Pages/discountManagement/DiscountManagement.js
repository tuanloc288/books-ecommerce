import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './discountManagement.css'
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import DiscountAccount from './DiscountAccount'
import DiscountCategory from './DiscountCategory'
import DiscountAccountForm from './DiscountAccountForm'
import DiscountCategoryForm from './DiscountCategoryForm'
import discountAccountMgmtSlice  from '../../../../reducers/componentsReducer/discountMgmt/discountAccountSlice'
import discountCategoryMgmtSlice  from '../../../../reducers/componentsReducer/discountMgmt/discountCategorySlice'

const DiscountManagement = () => {
  const showFormAcc = useSelector(state => state.discountAccountMgmt.showForm)
  const showFormCate = useSelector(state => state.discountCategoryMgmt.showForm)
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(discountAccountMgmtSlice.actions.setForm({type: '' , data: {}, show: false}))
      dispatch(discountCategoryMgmtSlice.actions.setForm({type: '' , data: {}, show: false}))
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
          !showFormAcc ? <DiscountAccount/> : <DiscountAccountForm/>
        }
        {
          !showFormCate ? <DiscountCategory/> : <DiscountCategoryForm/>
        }
      </div>
    </>
  );
};

export default DiscountManagement;
