import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../components/others/axiosInstance";

export const fetchAllAccounts = createAsyncThunk(
  "accountAPI/fetchAllAccounts",
  async (accessToken) => {
    try {
      const res = await axiosInstance.get(`account`, {
        headers: {
          token: "Bearer " + accessToken,
        },
      });
      return res.data;
    } catch (error) {
      return error;
    }
  }
);

const initialState = {
  isLoading: false,
  accountsList: [],
  error: "",
};

export default createSlice({
  name: "getAccounts",
  initialState,
  reducers: {
    updateAccount: (state, action) => {
      const accountUpdate = action.payload
      state.accountsList.map((item) => {
          if (item.userName === accountUpdate.userName) {
              Object.assign(item, accountUpdate);
              return state;
          }
      })
    },
    addAccount: (state, action) => {
      state.accountsList.push(action.payload)
    }, 
    removeAccount: (state, action) => {
       state.accountsList = state.accountsList.filter(item => item.userName !== action.payload)
    }, 
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllAccounts.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllAccounts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.accountsList = action.payload;
      state.error = "";
    });
    builder.addCase(fetchAllAccounts.rejected, (state, action) => {
      state.isLoading = false;
      state.accountsList = [];
      state.error = action.error.message;
    });
  },
});
