import axios from 'axios';
import axiosInstance from './axios-instance';

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface TokenRefreshResponse {
  token: string;
}

/**
 * 리프레시 토큰(HttpOnly 쿠키)으로 새 액세스 토큰 발급
 * - 인터셉터 순환 방지를 위해 plain axios 사용
 * - withCredentials: true 로 쿠키 자동 전송
 */
export const refreshAccessToken = async (): Promise<string> => {
  const { data } = await axios.post<TokenRefreshResponse>(
    `${BASE_URL}/auth/refresh`,
    null,
    { withCredentials: true }
  );
  return data.token;
};

/**
 * 로그아웃 — 서버에서 리프레시 토큰 쿠키 삭제 + DB 폐기
 */
export const logoutUser = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
};
