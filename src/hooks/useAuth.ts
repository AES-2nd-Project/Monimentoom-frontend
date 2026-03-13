import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, signup as signupApi } from '../api/users-api';
import type { RootState } from '../store';
import { logout as logoutAction, setLoginInfo } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, nickname } = useSelector(
    (state: RootState) => state.auth
  );

  // 로그인
  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: data => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('nickname', data.nickname);
      dispatch(setLoginInfo({ nickname: data.nickname }));
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
    dispatch(logoutAction());
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return {
    isLoggedIn,
    nickname,
    login: loginMutation.mutate,
    isPending: loginMutation.isPending,
    signup: signupMutation.mutate,
    isSignupPending: signupMutation.isPending,
    logout,
  };
};
