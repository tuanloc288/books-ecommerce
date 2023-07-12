import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../components/others/axiosInstance";

export const fetchAllPrivileged = createAsyncThunk(
  "privilegedAPI/fetchAllPrivileged",
  async (accessToken) => {
    try {
      const res = await axiosInstance.get(`privileged`, {
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
  privilegedList: [],
  error: "",
};

export default createSlice({
  name: "getPrivileged",
  initialState,
  reducers: {
    updatePrivileged: (state, action) => {
      const privilegedUpdate = action.payload
      state.privilegedList.map((item) => {
          if (item.privilegedID === privilegedUpdate.privilegedID) {
              Object.assign(item, privilegedUpdate);
              return state;
          }
      })
    },
    addPrivileged: (state, action) => {
      state.privilegedList.push(action.payload)
    }, 
    removePrivileged: (state, action) => {
       state.privilegedList = state.privilegedList.filter(item => item.privilegedID !== action.payload)
    }, 
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllPrivileged.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllPrivileged.fulfilled, (state, action) => {
      state.isLoading = false;
      state.privilegedList = action.payload;
      state.error = "";
    });
    builder.addCase(fetchAllPrivileged.rejected, (state, action) => {
      state.isLoading = false;
      state.privilegedList = [];
      state.error = action.error.message;
    });
  },
});
