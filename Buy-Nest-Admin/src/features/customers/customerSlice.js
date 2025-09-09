import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../API/axios"; 

export const fetchAllCustomers = createAsyncThunk(
  "customers/fetchAllCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/customers/all-users");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || err.message);
    }
  }
);

export const deleteCustomerAccount = createAsyncThunk(
  "customers/deleteCustomerAccount",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/customers/delete-customer/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || err.message);
    }
  }
);
const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
