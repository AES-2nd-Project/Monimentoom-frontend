import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  nickname: string;
  email: string;
  userId: number | null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: !!localStorage.getItem('accessToken'),
    nickname: localStorage.getItem('nickname') || '',
    email: localStorage.getItem('email') || '',
    userId: Number(localStorage.getItem('userId')) || null,
  } as AuthState,
  reducers: {
    // 로그인
    setLoginInfo: (
      state,
      action: PayloadAction<{ nickname: string; email: string; userId: number }>
    ) => {
      state.isLoggedIn = true;
      state.nickname = action.payload.nickname;
      state.email = action.payload.email;
      state.userId = action.payload.userId;
    },
    // 닉네임/프로필 업데이트
    updateUserInfo: (
      state,
      action: PayloadAction<{ nickname?: string }>
    ) => {
      if (action.payload.nickname) {
        state.nickname = action.payload.nickname;
      }
    },
    // 로그아웃
    logout: state => {
      state.isLoggedIn = false;
      state.nickname = '';
      state.email = '';
      state.userId = null;
    },
  },
});

export const { logout, setLoginInfo, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
