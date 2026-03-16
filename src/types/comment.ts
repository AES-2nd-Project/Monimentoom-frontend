export interface CommentResponse {
  id: number;
  nickname: string;
  profileImageUrl?: string | null;
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
