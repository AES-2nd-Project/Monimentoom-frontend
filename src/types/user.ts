export interface UserResponse {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
  description: string | null;
}

export interface UpdateProfileProps {
  nickname?: string;
  profileImageUrl?: string;
  description?: string;
}
