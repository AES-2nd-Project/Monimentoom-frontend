import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser as logoutUserApi } from '../api/auth-api';
import {
  getKakaoAuthUrl,
  kakaoLogin as kakaoLoginApi,
  kakaoSignup as kakaoSignupApi,
} from '../api/oauth-api';
import { updateProfile as updateProfileApi } from '../api/users-api';
import type { RootState } from '../store';
import {
  logout as logoutAction,
  setLoginInfo,
  updateUserInfo,
} from '../store/authSlice';
import type { UpdateProfileProps } from '../types/user';

/** 로그인/회원가입 응답 데이터 → localStorage + Redux 동기화 */
const syncUserInfo = (
  token: string,
  userId: number,
  nickname: string,
  dispatch: ReturnType<typeof useDispatch>,
  profileImageUrl?: string | null,
  description?: string | null,
) => {
  localStorage.setItem('accessToken', token);
  localStorage.setItem('userId', String(userId));
  localStorage.setItem('nickname', nickname);
  if (profileImageUrl) {
    localStorage.setItem('profileImageUrl', profileImageUrl);
  } else {
    localStorage.removeItem('profileImageUrl');
  }
  if (description) {
    localStorage.setItem('description', description);
  } else {
    localStorage.removeItem('description');
  }
  dispatch(setLoginInfo({ nickname, userId }));
  dispatch(updateUserInfo({ profileImageUrl: profileImageUrl ?? null, description: description ?? null }));
};

/** 카카오 로그인 페이지로 리다이렉트 (훅 불필요) */
export const redirectToKakao = () => {
  window.location.href = getKakaoAuthUrl();
};

/** Redux에서 인증 상태만 읽기 (mutation 없음) */
export const useAuthState = () => {
  const { isLoggedIn, nickname, userId, profileImageUrl, description } = useSelector(
    (state: RootState) => state.auth
  );
  return { isLoggedIn, nickname, userId, profileImageUrl, description };
};

/** 로그아웃 */
export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    logoutUserApi().catch(console.error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('nickname');
    localStorage.removeItem('userId');
    localStorage.removeItem('profileImageUrl');
    localStorage.removeItem('description');
    dispatch(logoutAction());
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return { logout };
};

/** 카카오 인가코드 → 로그인 처리 (KakaoCallback에서 사용) */
export const useKakaoLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const kakaoLoginMutation = useMutation({
    mutationFn: kakaoLoginApi,
    onSuccess: data => {
      if (data.token && data.userId && data.nickname) {
        syncUserInfo(data.token, data.userId, data.nickname, dispatch, data.profileImageUrl, data.description);
        navigate('/');
      } else if (data.signupToken) {
        navigate('/signup', { state: { signupToken: data.signupToken } });
      } else {
        alert('로그인 처리 중 문제가 발생했습니다. 다시 시도해주세요.');
        navigate('/');
      }
    },
    onError: (error: Error) => {
      alert(error.message);
      navigate('/');
    },
  });

  return {
    handleKakaoCallback: kakaoLoginMutation.mutate,
    isKakaoLoginPending: kakaoLoginMutation.isPending,
  };
};

/** 카카오 회원가입 (SignupForm에서 사용) */
export const useKakaoSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const kakaoSignupMutation = useMutation({
    mutationFn: kakaoSignupApi,
    onSuccess: data => {
      syncUserInfo(data.token, data.userId, data.nickname, dispatch, data.profileImageUrl, data.description);
      alert('회원가입이 완료되었습니다!');
      navigate('/');
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  return {
    kakaoSignup: kakaoSignupMutation.mutate,
    isKakaoSignupPending: kakaoSignupMutation.isPending,
  };
};

/** 프로필 수정 (MyPageForm에서 사용) */
export const useProfileUpdate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileProps) => updateProfileApi(data),
    onSuccess: data => {
      localStorage.setItem('nickname', data.nickname);
      if (data.profileImageUrl) {
        localStorage.setItem('profileImageUrl', data.profileImageUrl);
      } else {
        localStorage.removeItem('profileImageUrl');
      }
      if (data.description) {
        localStorage.setItem('description', data.description);
      } else {
        localStorage.removeItem('description');
      }
      dispatch(
        updateUserInfo({
          nickname: data.nickname,
          profileImageUrl: data.profileImageUrl ?? null,
          description: data.description ?? null,
        })
      );
      alert('프로필이 업데이트되었습니다.');
      navigate('/');
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  return {
    updateProfile: updateProfileMutation.mutate,
    isUpdateProfilePending: updateProfileMutation.isPending,
  };
};
