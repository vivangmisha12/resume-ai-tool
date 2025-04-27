// redux/action/user.js
import axiosInstance from "../axiosInstance";
import toast from 'react-hot-toast';

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });

    const res = await axiosInstance.get("/user/auth/me");

    dispatch({
      type: "LoadUserSuccess",
      payload: res.data.data,
    });

  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error?.response?.data?.message || "Unknown error occurred",
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axiosInstance.get("/user/auth/logout");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    toast.success("Logout successful!");

    dispatch({ type: "LogoutSuccess" });
  } catch (error) {
    dispatch({
      type: "LogoutFail",
      payload: error.response?.data?.message || "Logout failed",
    });
  }
};
