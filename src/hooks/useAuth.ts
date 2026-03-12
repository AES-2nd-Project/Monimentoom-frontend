import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/users-api';
import type { RootState } from '../store';
import { logout as logoutAction, setLoginInfo } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  // 로그인
  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: data => {
      localStorage.setItem('accessToken', data.accessToken);
      dispatch(setLoginInfo({ nickname: data.nickname }));
      navigate('/');
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // 로그아웃
  const logout = () => {
    dispatch(logoutAction());
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return {
    isLoggedIn,
    login: loginMutation.mutate,
    isPending: loginMutation.isPending,
    logout,
  };
};
