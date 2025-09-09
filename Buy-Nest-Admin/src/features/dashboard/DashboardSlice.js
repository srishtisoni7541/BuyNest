import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: { users: 0, sales: 0, orders: 0 },
  },
  reducers: {
    setStats: (state, action) => {
      state.stats = action.payload;
    },
  },
});

export const { setStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;
