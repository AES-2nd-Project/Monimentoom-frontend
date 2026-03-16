import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * 로그아웃 — 서버에서 리프레시 토큰 쿠키 삭제 + DB 폐기
 * axiosInstance를 import하면 순환 의존성이 생기므로 plain axios 사용
 */
export const logoutUser = async (): Promise<void> => {
  const token = localStorage.getItem('accessToken');
  await axios.post(
    `${BASE_URL}/auth/logout`,
    null,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    }
  );
};
