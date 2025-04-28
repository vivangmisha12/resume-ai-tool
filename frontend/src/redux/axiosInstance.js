// src/utils/axiosInstance.js
import axios from "axios";
import store from "./store"; // <-- import your redux store
import { logout } from "./actions/user"; // <-- your logout action

const axiosInstance = axios.create({
  baseURL: "https://resumeanalyser-x87w.onrender.com/api/v1",
  withCredentials: true,
});

// Interceptor for responses
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // avoid infinite loops

      try {
        const refreshResponse = await axios.get("https://resumeanalyser-x87w.onrender.com/api/v1/user/auth/refresh", {
          withCredentials: true,
        });

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Update the original request with new token if you pass Authorization
        // originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest); // retry the original request
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
