import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000", 
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
   withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers["x-access-token"];
    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
    }
    return response;
  },
  async (error) => {
    if (error.response) {
      if (
        error.response.status === 401 || // no access + no refresh
        error.response.status === 403    // refresh invalid/expired
      ) {
        console.error("Unauthorized! Token expired or invalid.");

        //  Prevent infinite redirect loop
        if (window.location.pathname !== "/login") {
          localStorage.removeItem("accessToken"); 
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
