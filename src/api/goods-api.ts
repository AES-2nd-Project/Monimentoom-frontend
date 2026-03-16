import type { GoodsRequest, GoodsResponse } from '../types/goods';
import axiosInstance from './axios-instance';

export type { GoodsRequest, GoodsResponse };

export const getGoods = async (): Promise<GoodsResponse[]> => {
  const response = await axiosInstance.get('/goods');
  return response.data;
};

export const createGoods = async (
  request: GoodsRequest
): Promise<GoodsResponse> => {
  const response = await axiosInstance.post('/goods', request);
  return response.data;
};

export const deleteGoods = async (goodsId: number): Promise<void> => {
  await axiosInstance.delete(`/goods/${goodsId}`);
};
