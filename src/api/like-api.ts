import axiosInstance from './axios-instance';

export interface LikeResponse {
  likeCount: number;
  isLiked: boolean;
}

export const postLike = async (roomId: number): Promise<LikeResponse> => {
  const response = await axiosInstance.post(`/likes/${roomId}`);
  return response.data;
};

export const deleteLike = async (roomId: number): Promise<LikeResponse> => {
  const response = await axiosInstance.delete(`/likes/${roomId}`);
  return response.data;
};
