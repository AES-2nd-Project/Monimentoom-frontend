import type {
  CommentCreateRequest,
  CommentPageResponse,
  CommentResponse,
  CommentUpdateRequest,
} from '../types/comment';
import axiosInstance from './axios-instance';

export const getCommentsScroll = async (
  roomId: number,
  cursorId?: number | null,
  size = 10
): Promise<CommentPageResponse> => {
  const params: Record<string, unknown> = { size };
  if (cursorId != null) params.cursorId = cursorId;
  const response = await axiosInstance.get(`/comments/${roomId}/scroll`, {
    params,
  });
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
