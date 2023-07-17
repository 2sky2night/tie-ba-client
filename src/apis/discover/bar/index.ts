import request from '@/utils/request';
import type { HotType, DiscoverBarResponse } from './types'

/**
 * 发现吧
 * @param type 热门类型 (1:24小时 2:3天 3:15天 4:3个月 5:1年)
 * @param page 页码
 * @param pageSize 页长度 
 */
export const discoverBarAPI = (type: HotType, page: number, pageSize: number) => {
  return request.get<DiscoverBarResponse>('/bar/discover', {
    params: {
      type,
      limit: pageSize,
      offset: (page - 1) * pageSize
    }
  })
}