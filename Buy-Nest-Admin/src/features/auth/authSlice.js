import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../API/axios";

//  Fetch current user
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/profile");
      console.log(res);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch user");
    }
  }
);

//  Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.post("/admin/forgot-password", { email });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to send reset link"
      );
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/admin/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });
      // console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

//  Update profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (updatedData, { rejectWithValue }) => {
    try {
      const res = await api.post(`/admin/update-profile`, updatedData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update profile");
    }
  }
);

//  Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/admin/logout");
      localStorage.removeItem("accessToken");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to logout");
    }
  }
);

//  Delete Account
export const deleteUserAccount = createAsyncThunk(
  "auth/deleteUserAccount",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/admin/delete-account");
      localStorage.removeItem("accessToken");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete account!");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("accessToken");
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Reset link sent!";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Password reset successfully";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = "Profile updated successfully!";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.success = "Logged out successfully!";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 deleteUserAccount
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.success = "Account deleted successfully!";
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;
