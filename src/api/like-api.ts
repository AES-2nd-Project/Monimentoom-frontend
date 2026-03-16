import type { LikeResponse } from '../types/like';
import axiosInstance from './axios-instance';

export type { LikeResponse };

export const postLike = async (roomId: number): Promise<LikeResponse> => {
  const response = await axiosInstance.post(`/likes/${roomId}`);
  return response.data;
};

export const deleteLike = async (roomId: number): Promise<LikeResponse> => {
  const response = await axiosInstance.delete(`/likes/${roomId}`);
  return response.data;
};
