import { createSlice } from "@reduxjs/toolkit";

// Initial state: User is not authenticated by default
const initialState = {
  user: null,             // User data will be stored here
  accessToken: null,      // Stores the access token for authenticated user
  isAuthenticated: false, // Authentication status (true or false)
};

// Create slice to manage authentication logic
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to update state when user successfully logs in
    loginSuccess: (state, action) => {
      state.user = action.payload.user;             // Store user data
      state.accessToken = action.payload.accessToken; // Store access token
      state.isAuthenticated = true;                  // Set authentication status to true
    },
    // Action to log out and reset authentication state
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

// Export the loginSuccess and logout actions to be used in other components
export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
