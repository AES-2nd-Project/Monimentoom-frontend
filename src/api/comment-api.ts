import type {
  CommentCreateRequest,
  CommentResponse,
  CommentUpdateRequest,
} from '../types/comment';
import axiosInstance from './axios-instance';

export const getComments = async (
  roomId: number
): Promise<CommentResponse[]> => {
  const response = await axiosInstance.get(`/comments/${roomId}`);
  return response.data;
};

export const createComment = async (
  request: CommentCreateRequest
): Promise<CommentResponse> => {
  const response = await axiosInstance.post('/comments', request);
  return response.data;
};

export const updateComment = async (
  commentId: number,
  request: CommentUpdateRequest
): Promise<CommentResponse> => {
  const response = await axiosInstance.patch(`/comments/${commentId}`, request);
  return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
  await axiosInstance.delete(`/comments/${commentId}`);
};
