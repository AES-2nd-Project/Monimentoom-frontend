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

export const updateRoomFrameImage = async (
  roomId: number,
  frameImageUrl: string | null
): Promise<void> => {
  await axiosInstance.patch(`/rooms/${roomId}`, { frameImageUrl });
};
