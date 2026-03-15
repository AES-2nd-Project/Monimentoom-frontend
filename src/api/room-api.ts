import type { RoomPositionResponse } from '../types/position';
import axiosInstance from './axios-instance';

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
