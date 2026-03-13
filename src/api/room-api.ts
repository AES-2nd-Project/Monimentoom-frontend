import axiosInstance from './axios-instance';
import type { RoomPositionResponse } from '../types/position';

export const getRoomMain = async (
  nickname: string
): Promise<RoomPositionResponse> => {
  const response = await axiosInstance.get(`/rooms/${nickname}/main`);
  return response.data;
};
