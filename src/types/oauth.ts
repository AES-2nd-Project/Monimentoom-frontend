export interface KakaoLoginResponse {
  signupToken: string | null;
  token: string | null;
  userId: number | null;
  nickname: string | null;
  email: string | null;
}

export interface KakaoSignupRequest {
  signupToken: string;
  nickname: string;
  email: string;
}

export interface KakaoSignupResponse {
  token: string;
  userId: number;
  nickname: string;
  email: string;
}
