import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  nickname: string;
  userId: number | null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: !!localStorage.getItem('accessToken'),
    nickname: localStorage.getItem('nickname') || '',
    userId: Number(localStorage.getItem('userId')) || null,
  } as AuthState,
  reducers: {
    setLoginInfo: (
      state,
      action: PayloadAction<{ nickname: string; userId: number }>
    ) => {
      state.isLoggedIn = true;
      state.nickname = action.payload.nickname;
      state.userId = action.payload.userId;
    },
    updateUserInfo: (state, action: PayloadAction<{ nickname?: string }>) => {
      if (action.payload.nickname) {
        state.nickname = action.payload.nickname;
      }
    },
    logout: state => {
      state.isLoggedIn = false;
      state.nickname = '';
      state.userId = null;
    },
  },
});

export const { logout, setLoginInfo, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
