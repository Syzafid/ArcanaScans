import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const { id, username, email, isAdmin = false } = action.payload;
      state.user = { id, username, email, isAdmin };
      state.isAuthenticated = true;
      state.isAdmin = isAdmin;
      state.error = null;
      localStorage.setItem('authUser', JSON.stringify(state.user));
    },
    signupUser: (state, action) => {
      const { id, username, email } = action.payload;
      state.user = { id, username, email, isAdmin: false };
      state.isAuthenticated = true;
      localStorage.setItem('authUser', JSON.stringify(state.user));
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.error = null;
      localStorage.removeItem('authUser');
    },
    setUserFromStorage: (state) => {
      const savedUser = localStorage.getItem('authUser');
      if (savedUser) {
        state.user = JSON.parse(savedUser);
        state.isAuthenticated = true;
        state.isAdmin = state.user.isAdmin || false;
      }
    },
    setUserLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserError: (state, action) => {
      state.error = action.payload;
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('authUser', JSON.stringify(state.user));
      }
    },
  },
});

export const {
  loginUser,
  signupUser,
  logoutUser,
  setUserFromStorage,
  setUserLoading,
  setUserError,
  updateUserProfile,
} = userSlice.actions;

export default userSlice.reducer;
