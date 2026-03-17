export interface KakaoLoginResponse {
  signupToken: string | null;
  token: string | null;
  userId: number | null;
  nickname: string | null;
  profileImageUrl: string | null;
  description: string | null;
}

export interface KakaoSignupRequest {
  signupToken: string;
  nickname: string;
  profileImageUrl?: string | null;
  description?: string | null;
}

export interface KakaoSignupResponse {
  token: string;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  description: string | null;
}
