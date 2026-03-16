export interface UserResponse {
  id: number;
  nickname: string;
  mainRoomId: number | null;
}

export interface UpdateProfileProps {
  nickname: string;
  profileImageUrl?: string;
}
