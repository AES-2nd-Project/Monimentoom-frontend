import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    logout: state => {
      state.isLoggedIn = false;
      localStorage.removeItem('accessToken');
    },
  },
});

export const { setLoggedIn, logout } = authSlice.actions;
export default authSlice.reducer;
