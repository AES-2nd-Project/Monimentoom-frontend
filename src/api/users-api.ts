import axios from 'axios';
import { ERROR_MESSAGES, type ErrorCode } from '../constants/error-messages';
import axiosInstance from './axios-instance';

interface LoginProps {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginProps) => {
  try {
    const response = await axiosInstance.post('/users/login', {
      email,
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
