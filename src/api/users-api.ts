import axios from 'axios';
import { ERROR_MESSAGES, type ErrorCode } from '../constants/error-messages';
import axiosInstance from './axios-instance';

interface LoginProps {
  email: string;
  password: string;
}

interface SignupProps {
  email: string;
  nickname: string;
  password: string;
}

interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  mainRoomId: number | null;
}

export const login = async ({ email, password }: LoginProps) => {
  try {
    const response = await axiosInstance.post('/users/login', {
      email,
      password,
    });

    const authHeader = response.headers['authorization'];
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    return {
      ...response.data,
      accessToken: token,
      nickname: response.data.nickname,
    };
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

interface UpdateProfileProps {
  nickname: string;
  profileImageUrl?: string;
  newPassword?: string;
}

// TODO: 백엔드에서 PATCH /users/{id} 엔드포인트 추가 필요
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

export const signup = async ({
  email,
  nickname,
  password,
}: SignupProps): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.post('/users/signup', {
      email,
      nickname,
      password,
    });
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
