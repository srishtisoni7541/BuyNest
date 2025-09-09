// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../API/axios"; 

// export const fetchAllOrders = createAsyncThunk(
//   "orders/fetchAllOrders",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/orders/all-orders"); 
//       return res.data.orders;
//     } catch (err) {
//       return rejectWithValue(err.response.data.message || err.message);
//     }
//   }
// );

// const orderSlice = createSlice({
//   name: "order",
//   initialState: {
//     orders: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAllOrders.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllOrders.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders = action.payload;
//       })
//       .addCase(fetchAllOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default orderSlice.reducer;



// orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../API/axios"; 

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/orders/all-orders"); 
      return res.data.orders;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// New thunk to update order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await api.put("/orders/update-status", { orderId, status });
      return res.data.order; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
