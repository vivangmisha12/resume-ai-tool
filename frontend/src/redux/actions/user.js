import axios from 'axios';
import toast from 'react-hot-toast';

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });

    const res = await axios.get(`http://localhost:8000/api/v1/user/auth/me`, {
      withCredentials: true,
    });

    dispatch({
      type: "LoadUserSuccess",
      payload: res.data.data,
    });

  } catch (error) {
    const errMsg = error?.response?.data?.message;

    if (errMsg === "Refresh the access token to continue") {
      try {
        // Refresh the token
        const refreshRes = await axios.get("http://localhost:8000/api/v1/user/auth/refresh", {
          withCredentials: true,
        });

        // Save the new access token
        localStorage.setItem("accessToken", refreshRes.data.accessToken);

        // Retry original request
        const res = await axios.get(`http://localhost:8000/api/v1/user/auth/me`, {
          withCredentials: true,
        });

        dispatch({
          type: "LoadUserSuccess",
          payload: res.data.data, // ✅ fixed here too
        });

      } catch (refreshErr) {
        dispatch({
          type: "LoadUserFail",
          payload: refreshErr?.response?.data?.message || "Could not refresh token",
        });
      }
    } else {
      dispatch({
        type: "LoadUserFail",
        payload: errMsg || "Unknown error occurred",
      });
    }
  }
};

export const logout = () => async (dispatch) => {
    try {
      await axios.get("http://localhost:8000/api/v1/user/auth/logout", {
        withCredentials: true,
      });

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