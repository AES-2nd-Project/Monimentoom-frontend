import type { PresignedUrlResponse } from '../types/s3';
import axiosInstance from './axios-instance';

export type { PresignedUrlResponse };

export const getGoodsPresignedUrl = async (
  fileName: string
): Promise<PresignedUrlResponse> => {
  const response = await axiosInstance.get('/s3/presigned-url/goods', {
    params: { fileName },
  });
  return response.data;
};

export const getProfilePresignedUrl = async (
  fileName: string
): Promise<PresignedUrlResponse> => {
  const response = await axiosInstance.get('/s3/presigned-url/profile', {
    params: { fileName },
  });
  return response.data;
};

export const getFramePresignedUrl = async (
  fileName: string
): Promise<PresignedUrlResponse> => {
  const response = await axiosInstance.get('/s3/presigned-url/frame', {
    params: { fileName },
  });
  return response.data;
};

export const getEaselPresignedUrl = async (
  fileName: string
): Promise<PresignedUrlResponse> => {
  const response = await axiosInstance.get('/s3/presigned-url/easel', {
    params: { fileName },
  });
  return response.data;
};

export const deleteS3File = async (imageUrl: string): Promise<void> => {
  await axiosInstance.delete('/s3/presigned-url/file', {
    params: { imageUrl },
  });
};

// S3에 직접 PUT (JWT 불필요, presigned URL 자체가 인증 포함)
export const uploadToS3 = async (
  presignedUrl: string,
  file: File,
  contentType: string
): Promise<void> => {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': contentType },
  });
  if (!response.ok) {
    throw new Error(
      `S3 업로드 실패: ${response.status} ${response.statusText}`
    );
  }
};
