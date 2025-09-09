import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "../features/categories/CategorySlice";
import productsReducer from "../features/products/ProductSlice";
import ordersReducer from "../features/orders/OrderSlice";
import dashboardReducer from "../features/dashboard/DashboardSlice";
import authReducer from '../features/auth/authSlice';
import customerReducer from '../features/customers/customerSlice';

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products: productsReducer,
    orders: ordersReducer,
    dashboard: dashboardReducer,
    auth:authReducer,
    customers: customerReducer
  },
});