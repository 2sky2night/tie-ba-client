import request from '@/utils/request';
import type { BarListResponse } from '../public/types/bar';

/**
 * 浏览所有吧
 * @param page 页码 
 * @param pageSize 页长度
 * @param desc 根据创建吧的时间升序或降序
 * @returns 
 */
export const getAllBarListAPI = (page: number, pageSize: number, desc: boolean) => {
  return request.get<BarListResponse>('/bar/list', {
    params: {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      desc: desc ? 1 : 0
    }
  })
}