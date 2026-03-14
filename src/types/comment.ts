export interface CommentResponse {
  id: number;
  nickname: string;
  createdAt: string;
  content: string;
}

export interface CommentCreateRequest {
  roomId: number;
  content: string;
}

export interface CommentUpdateRequest {
  content: string;
}
