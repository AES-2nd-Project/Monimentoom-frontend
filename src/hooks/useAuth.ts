import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  login as loginApi,
  signup as signupApi,
  updateProfile as updateProfileApi,
} from '../api/users-api';
import type { RootState } from '../store';
import {
  logout as logoutAction,
  setLoginInfo,
  updateUserInfo,
} from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, nickname, email, userId } = useSelector(
    (state: RootState) => state.auth
  );

  // 로그인
  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: data => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('nickname', data.nickname);
      localStorage.setItem('email', data.email);
      localStorage.setItem('userId', String(data.id));
      dispatch(
        setLoginInfo({ nickname: data.nickname, email: data.email, userId: data.id })
      );
      navigate('/');
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // 회원가입 — 토큰 없이 가입만 처리, 완료 후 홈으로 이동해서 로그인
  const signupMutation = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/', { state: { shouldScroll: true } });
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // 비밀번호 인증 — 로그인 API 재활용
  const verifyPasswordMutation = useMutation({
    mutationFn: (password: string) => loginApi({ email, password }),
  });

  // 프로필 업데이트
  const updateProfileMutation = useMutation({
    mutationFn: ({
      nickname: newNickname,
      profileImageUrl,
      newPassword,
    }: {
      nickname: string;
      profileImageUrl?: string;
      newPassword?: string;
    }) => updateProfileApi(userId!, { nickname: newNickname, profileImageUrl, newPassword }),
    onSuccess: data => {
      localStorage.setItem('nickname', data.nickname);
      dispatch(updateUserInfo({ nickname: data.nickname }));
      alert('프로필이 업데이트되었습니다.');
      navigate('/');
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // 로그아웃
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('nickname');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    dispatch(logoutAction());
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return {
    isLoggedIn,
    nickname,
    email,
    userId,
    login: loginMutation.mutate,
    isPending: loginMutation.isPending,
    signup: signupMutation.mutate,
    isSignupPending: signupMutation.isPending,
    verifyPassword: verifyPasswordMutation.mutateAsync,
    isVerifyPending: verifyPasswordMutation.isPending,
    updateProfile: updateProfileMutation.mutate,
    isUpdateProfilePending: updateProfileMutation.isPending,
    logout,
  };
};
