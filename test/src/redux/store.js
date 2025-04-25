import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

// Configuring the Redux store with authSlice reducer to manage user authentication state
const store = configureStore({
  reducer: {
    auth: authReducer,  // Handles authentication state
  },
});

export default store;
