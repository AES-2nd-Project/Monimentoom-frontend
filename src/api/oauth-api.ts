import axios from 'axios';
import { ERROR_MESSAGES, type ErrorCode } from '../constants/error-messages';
import axiosInstance from './axios-instance';

// 카카오 로그인 1단계 응답
export interface KakaoLoginResponse {
  isNewUser: boolean;
  signupToken: string | null; // 신규 유저일 때만
  token: string | null; // 기존 유저일 때만
}

// 카카오 회원가입 요청
export interface KakaoSignupRequest {
  signupToken: string;
  nickname: string;
  email: string;
}

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
 * → Authorization 헤더에서 JWT 추출
 */
export const kakaoSignup = async (
  request: KakaoSignupRequest
): Promise<string> => {
  try {
    const response = await axiosInstance.post('/oauth/kakao/signup', request);
    const authHeader = response.headers['authorization'];
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;
    if (!token) throw new Error('토큰을 받지 못했습니다.');
    return token;
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
export const getKakaoAuthUrl = () => {
  const clientId = import.meta.env.VITE_KAKAO_CLIENT;
  const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  return `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
};
