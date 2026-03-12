import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  nickname: string;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: !!localStorage.getItem('accessToken'),
    nickname: localStorage.getItem('nickname') || '',
  } as AuthState,
  reducers: {
    // 로그인
    setLoginInfo: (
      state,
      action: PayloadAction<{ nickname: string; token: string }>
    ) => {
      state.isLoggedIn = true;
      state.nickname = action.payload.nickname;
      localStorage.setItem('accessToken', action.payload.token);
      localStorage.setItem('nickname', action.payload.nickname);
    },
    // 로그아웃
    logout: state => {
      state.isLoggedIn = false;
      state.nickname = '';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('nickname');
    },
  },
});

export const { logout, setLoginInfo } = authSlice.actions;
export default authSlice.reducer;
