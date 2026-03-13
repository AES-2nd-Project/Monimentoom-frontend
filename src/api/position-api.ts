import axiosInstance from './axios-instance';
import type { PositionRequest, PositionResponse } from '../types/position';

export const createPosition = async (
  request: PositionRequest
): Promise<PositionResponse> => {
  const response = await axiosInstance.post('/position', request);
  return response.data;
};

export const updatePosition = async (
  id: number,
  request: PositionRequest
): Promise<PositionResponse> => {
  const response = await axiosInstance.patch(`/position/${id}`, request);
  return response.data;
};

export const deletePosition = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/position/${id}`);
};
