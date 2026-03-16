import axios from 'axios';
import { ERROR_MESSAGES, type ErrorCode } from '../constants/error-messages';
import axiosInstance from './axios-instance';

const DEVICE_ID = 'default';

interface TokenRefreshResponse {
  token: string;
  refreshToken: string;
}

/**
 * 리프레시 토큰으로 새 토큰 쌍 발급
 * - 401 인터셉터에서 자동 호출됨
 * - axiosInstance 대신 plain axios 사용 (인터셉터 순환 방지)
 */
export const refreshTokens = async (
  refreshToken: string
): Promise<TokenRefreshResponse> => {
  const response = await axios.post<TokenRefreshResponse>(
    `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
    { refreshToken, deviceId: DEVICE_ID }
  );
  return response.data;
};

/**
 * 로그아웃 — 서버에서 리프레시 토큰 폐기
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await axiosInstance.post(`/auth/logout?deviceId=${DEVICE_ID}`);
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
