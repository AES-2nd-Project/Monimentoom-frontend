import axios from 'axios';
import { ERROR_MESSAGES, type ErrorCode } from '../constants/error-messages';
import axiosInstance from './axios-instance';

export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  mainRoomId: number | null;
}

interface UpdateProfileProps {
  nickname: string;
  profileImageUrl?: string;
}

// TODO: 백엔드에 GET /users/me 엔드포인트 추가 필요
// @GetMapping("/me") + @AuthenticationPrincipal Long userId → UserResponse.from(user)
export const getMe = async (): Promise<UserResponse> => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

export const updateProfile = async (
  userId: number,
  data: UpdateProfileProps
): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.patch(`/users/${userId}`, data);
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

export const logoutUser = async (): Promise<void> => {
  await axiosInstance.post('/users/logout');
};
