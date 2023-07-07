import request from '@/utils/request';
import type { ImgFileResponse } from './types';
/**
 * 上传图片
 * @param data 
 * @returns 
 */
export const uploadImgAPI = (data: FormData) => {
  return request.post<ImgFileResponse>('/file/image',data)
}