import type { CommentResponse } from './comment';

export interface RoomDetailResponse {
  roomId: number;
  name: string;
  userProfileImageUrl: string | null;
  nickname: string;
  isLoggedIn: boolean;
  isMine: boolean;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  userCreatedAt: string;
  comments: CommentResponse[];
}

export interface ShowcaseItem {
  imageUrl: string;
  goodsName: string;
  ownerNickname: string;
}

export type Direction = 'Left' | 'Right';

export interface Coordinate {
  r: number;
  c: number;
}

export interface Bounds {
  r1: number;
  r2: number;
  c1: number;
  c2: number;
}

export interface Item extends Bounds {
  id: number;
  positionId?: number;
  goodsId?: number;
  imageSrc?: string;
  goodsName?: string;
  goodsDescription?: string;
}
