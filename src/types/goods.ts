export interface GoodsRequest {
  name: string;
  imageUrl: string;
  description?: string;
  price?: number;
}

export interface GoodsResponse {
  id: number;
  userId: number;
  name: string;
  description?: string;
  imageUrl: string;
  price?: number;
  createdAt: string;
  positions: unknown[];
}
