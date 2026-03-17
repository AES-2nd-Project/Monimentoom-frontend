export interface CommentResponse {
  id: number;
  nickname: string;
  profileImageUrl?: string | null;
  createdAt: string;
  content: string;
}

export interface CommentPageResponse {
  comments: CommentResponse[];
  nextCursorId: number | null;
  hasNext: boolean;
}

export interface CommentCreateRequest {
  roomId: number;
  content: string;
}

export interface CommentUpdateRequest {
  content: string;
}
