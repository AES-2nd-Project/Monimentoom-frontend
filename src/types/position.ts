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
  imageUrl?: string; // 백엔드에서 goods.imageUrl을 포함해줘야 함
}

export interface RoomPositionResponse {
  roomId: number;
  userId: number;
  nickname?: string; // 방 주인 닉네임 (랜덤 방 방문 등에서 URL 이동에 사용)
  name: string;
  positions: PositionResponse[];
  frameImageUrl?: string | null;
}
