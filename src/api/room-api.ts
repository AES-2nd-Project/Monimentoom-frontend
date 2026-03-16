import type { RoomPositionResponse } from '../types/position';
import type { RoomDetailResponse } from '../types/room';
import axiosInstance from './axios-instance';

export type { RoomDetailResponse };

export const getRoomDetail = async (
  roomId: number
): Promise<RoomDetailResponse> => {
  const response = await axiosInstance.get(`/rooms/${roomId}/detail`);
  return response.data;
};

export const getRoomMain = async (
  nickname: string
): Promise<RoomPositionResponse> => {
  const response = await axiosInstance.get(`/rooms/${nickname}/main`);
  return response.data;
};

export const getRandomRoom = async (): Promise<RoomPositionResponse> => {
  const response = await axiosInstance.get('/rooms/random');
  return response.data;
};

export const updateRoomImages = async (
  roomId: number,
  frameImageUrl: string | null,
  easelImageUrl: string | null
): Promise<void> => {
  await axiosInstance.patch(`/rooms/${roomId}`, {
    updateImages: true,
    frameImageUrl,
    easelImageUrl,
  });
};
