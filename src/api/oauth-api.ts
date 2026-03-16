import axios from 'axios';
import { ERROR_MESSAGES, type ErrorCode } from '../constants/error-messages';
import type {
  KakaoLoginResponse,
  KakaoSignupRequest,
  KakaoSignupResponse,
} from '../types/oauth';
import axiosInstance from './axios-instance';

export type { KakaoLoginResponse, KakaoSignupRequest, KakaoSignupResponse };

/**
 * 1단계: 카카오 인가코드를 서버로 전달 → 기존/신규 유저 판별
 * - 기존 유저: { isNewUser: false, token: "jwt..." }
 * - 신규 유저: { isNewUser: true, signupToken: "temp-jwt..." }
 */
export const kakaoLogin = async (code: string): Promise<KakaoLoginResponse> => {
  try {
    const response = await axiosInstance.post('/oauth/kakao', { code });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorCode = error.response?.data?.code as ErrorCode;
      const errorMessage =
        ERROR_MESSAGES[errorCode] ||
        error.response?.data?.message ||
        ERROR_MESSAGES.DEFAULT;
      throw new Error(errorMessage);
    }
    throw new Error(ERROR_MESSAGES.DEFAULT);
  }
};

/**
 * 2단계: 신규 유저 닉네임/이메일 입력 후 회원가입
 * → 응답 body에서 token + 유저 정보 추출
 */
export const kakaoSignup = async (
  request: KakaoSignupRequest
): Promise<KakaoSignupResponse> => {
  try {
    const response = await axiosInstance.post('/oauth/kakao/signup', request);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorCode = error.response?.data?.code as ErrorCode;
      const errorMessage =
        ERROR_MESSAGES[errorCode] ||
        error.response?.data?.message ||
        ERROR_MESSAGES.DEFAULT;
      throw new Error(errorMessage);
    }
    throw new Error(ERROR_MESSAGES.DEFAULT);
  }
};

/**
 * 카카오 인가 페이지 URL 생성
 */
export const getKakaoAuthUrl = (): string => {
  const clientId = import.meta.env.VITE_KAKAO_CLIENT;
  const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    throw new Error(
      '카카오 로그인 환경변수(VITE_KAKAO_CLIENT, VITE_KAKAO_REDIRECT_URI)가 설정되지 않았습니다.'
    );
  }
  return (
    `https://kauth.kakao.com/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code`
  );
};
