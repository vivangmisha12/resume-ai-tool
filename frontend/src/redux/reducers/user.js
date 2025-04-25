import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  loaded: false, // ✅ New flag to track if auth check is done
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("LoadUserRequest", (state) => {
      state.loading = true;
      state.loaded = false; // ✅ Reset when request starts
    })
    .addCase("LoadUserSuccess", (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload || {};
      state.loaded = true; // ✅ Mark done
    })
    .addCase("LoadUserFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
      state.loaded = true; // ✅ Still mark done even if failed
    })
    .addCase("LogoutSuccess", (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.loaded = true;
    })
    .addCase("LogoutFail", (state, action) => {
      state.error = action.payload;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
