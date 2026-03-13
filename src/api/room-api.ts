import axiosInstance from './axios-instance';
import type { RoomPositionResponse } from '../types/position';

export const getRoomMain = async (
  nickname: string
): Promise<RoomPositionResponse> => {
  const response = await axiosInstance.get(`/rooms/${nickname}/main`);
  return response.data;
};

// TODO: 백엔드에서 RoomUpdateRequest에 frameImageUrl 추가 후 활성화
export const updateRoomFrameImage = async (
  roomId: number,
  frameImageUrl: string | null
): Promise<void> => {
  await axiosInstance.patch(`/rooms/${roomId}`, { frameImageUrl });
};
