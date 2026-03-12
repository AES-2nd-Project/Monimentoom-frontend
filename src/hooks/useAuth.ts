import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/users-api';
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
      dispatch(
        setLoginInfo({ nickname: data.nickname, token: data.accessToken })
      );
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
    nickname,
    login: loginMutation.mutate,
    isPending: loginMutation.isPending,
    logout,
  };
};
