import axios from 'axios';
import { ERROR_MESSAGES, type ErrorCode } from '../constants/error-messages';
import type { UpdateProfileProps, UserResponse } from '../types/user';
import axiosInstance from './axios-instance';

export type { UpdateProfileProps, UserResponse };

export const getUserProfile = async (userId: number): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.get(`/users/profile/${userId}`);
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

export const updateProfile = async (
  data: UpdateProfileProps
): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.patch('/users/profile/me', data);
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
