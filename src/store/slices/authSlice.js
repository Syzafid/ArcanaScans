import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { id, email, role, name } = action.payload;
      state.user = { id, email, role, name };
      state.isAuthenticated = true;
      state.isAdmin = role === 'admin';
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.error = null;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
    signup: (state, action) => {
      const { id, email, role, name } = action.payload;
      state.user = { id, email, role, name };
      state.isAuthenticated = true;
      state.isAdmin = false;
      state.error = null;
    },
  },
});

export const { login, logout, signup, setAuthError } = authSlice.actions;
export default authSlice.reducer;
