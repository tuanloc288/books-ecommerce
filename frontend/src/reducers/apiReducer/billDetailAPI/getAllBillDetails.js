import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../components/others/axiosInstance";

export const fetchAllBillDetails = createAsyncThunk(
  "billDetailAPI/fetchAllBillDetails",
  async (props) => {
    try {
      const res = await axiosInstance.get(`billDetail/${props.billID}`, {
        headers: {
          token: "Bearer " + props.accessToken,
        },
      });
      return res.data;
    } catch (error) {
      return error;
    }
  }
);

const initialState = {
  isLoading: true,
  billDetailsList: [],
  error: "",
};
export default createSlice({
  name: "getBillDetails",
  initialState,
  reducers: {
    removeBillDetail: (state, action) => {
      state.billDetailsList = state.billDetailsList.filter(
        (item) => item.billDetailID !== action.payload
      );
      return state;
    },
    updateBillDetail: (state, action) => {
      const billDetailUpdate = action.payload;
      state.billDetailsList.map((item) => {
        if (item.billDetailID === billDetailUpdate.billDetailID) {
          Object.assign(item, billDetailUpdate);
          return state;
        }
      });
    },
    addBillDetail: (state, action) => {
      state.billDetailsList.push(action.payload);
    },
    clearBillDetail: (state) => {
      state.billDetailsList = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllBillDetails.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllBillDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.billDetailsList = action.payload;
      state.error = "";
    });
    builder.addCase(fetchAllBillDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.billDetailsList = [];
      state.error = action.error.message;
    });
  },
});
