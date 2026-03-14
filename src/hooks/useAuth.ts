import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getKakaoAuthUrl,
  kakaoLogin as kakaoLoginApi,
  kakaoSignup as kakaoSignupApi,
} from '../api/oauth-api';
import {
  logoutUser as logoutUserApi,
  updateProfile as updateProfileApi,
} from '../api/users-api';
import type { RootState } from '../store';
import {
  logout as logoutAction,
  setLoginInfo,
  updateUserInfo,
} from '../store/authSlice';

/** 로그인/회원가입 응답 데이터 → localStorage + Redux 동기화 */
const syncUserInfo = (
  token: string,
  userId: number,
  nickname: string,
  email: string,
  dispatch: ReturnType<typeof useDispatch>
) => {
  localStorage.setItem('accessToken', token);
  localStorage.setItem('userId', String(userId));
  localStorage.setItem('nickname', nickname);
  localStorage.setItem('email', email);
  dispatch(setLoginInfo({ nickname, email, userId }));
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, nickname, email, userId } = useSelector(
    (state: RootState) => state.auth
  );

  // 카카오 로그인 페이지로 리다이렉트
  const redirectToKakao = () => {
    window.location.href = getKakaoAuthUrl();
  };

  // 카카오 인가코드 처리 (콜백 페이지에서 호출)
  const kakaoLoginMutation = useMutation({
    mutationFn: kakaoLoginApi,
    onSuccess: async data => {
      if (
        !data.isNewUser &&
        data.token &&
        data.userId &&
        data.nickname &&
        data.email
      ) {
        // 기존 유저: 응답 데이터로 바로 동기화 → 홈으로
        syncUserInfo(
          data.token,
          data.userId,
          data.nickname,
          data.email,
          dispatch
        );
        navigate('/');
      } else if (data.isNewUser && data.signupToken) {
        // 신규 유저: 닉네임/이메일 입력 페이지로
        navigate('/signup', { state: { signupToken: data.signupToken } });
      }
    },
    onError: (error: Error) => {
      alert(error.message);
      navigate('/');
    },
  });

  // 카카오 회원가입 (닉네임/이메일 입력 후)
  const kakaoSignupMutation = useMutation({
    mutationFn: kakaoSignupApi,
    onSuccess: data => {
      syncUserInfo(
        data.token,
        data.userId,
        data.nickname,
        data.email,
        dispatch
      );
      alert('회원가입이 완료되었습니다!');
      navigate('/');
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // 프로필 업데이트
  const updateProfileMutation = useMutation({
    mutationFn: ({
      nickname: newNickname,
      profileImageUrl,
    }: {
      nickname: string;
      profileImageUrl?: string;
    }) => {
      if (userId == null)
        return Promise.reject(new Error('로그인이 필요합니다.'));
      return updateProfileApi(userId, {
        nickname: newNickname,
        profileImageUrl,
      });
    },
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
    logoutUserApi().catch(console.error);
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
    redirectToKakao,
    handleKakaoCallback: kakaoLoginMutation.mutate,
    isKakaoLoginPending: kakaoLoginMutation.isPending,
    kakaoSignup: kakaoSignupMutation.mutate,
    isKakaoSignupPending: kakaoSignupMutation.isPending,
    updateProfile: updateProfileMutation.mutate,
    isUpdateProfilePending: updateProfileMutation.isPending,
    logout,
  };
};
