export type WallSide = 'LEFT' | 'RIGHT';

export interface PositionRequest {
  goodsId: number;
  roomId: number;
  wallSide: WallSide;
  x: number;
  y: number;
  widthUnit: number;
  heightUnit: number;
}

export interface PositionResponse {
  id: number;
  goodsId: number;
  roomId: number;
  wallSide: WallSide;
  x: number;
  y: number;
  widthUnit: number;
  heightUnit: number;
  imageUrl?: string;
  goodsName?: string;
  goodsDescription?: string;
}

export interface RoomPositionResponse {
  roomId: number;
  userId: number;
  nickname?: string; // 방 주인 닉네임 (랜덤 방 방문 등에서 URL 이동에 사용)
  name: string;
  positions: PositionResponse[];
  frameImageUrl?: string | null;
  easelImageUrl?: string | null;
}
