import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  nickname: string;
  userId: number | null;
  profileImageUrl: string | null;
  description: string | null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: !!localStorage.getItem('accessToken'),
    nickname: localStorage.getItem('nickname') || '',
    userId: Number(localStorage.getItem('userId')) || null,
    profileImageUrl: localStorage.getItem('profileImageUrl') || null,
    description: localStorage.getItem('description') || null,
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
    updateUserInfo: (
      state,
      action: PayloadAction<{
        nickname?: string;
        profileImageUrl?: string | null;
        description?: string | null;
      }>
    ) => {
      if (action.payload.nickname !== undefined) {
        state.nickname = action.payload.nickname;
      }
      if (action.payload.profileImageUrl !== undefined) {
        state.profileImageUrl = action.payload.profileImageUrl;
      }
      if (action.payload.description !== undefined) {
        state.description = action.payload.description;
      }
    },
    logout: state => {
      state.isLoggedIn = false;
      state.nickname = '';
      state.userId = null;
      state.profileImageUrl = null;
      state.description = null;
    },
  },
});

export const { logout, setLoginInfo, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
