export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  mainRoomId: number | null;
}

export interface UpdateProfileProps {
  nickname: string;
  profileImageUrl?: string;
}
