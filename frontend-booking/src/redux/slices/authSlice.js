import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!localStorage.getItem("token"),
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;