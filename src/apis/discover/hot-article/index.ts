import request from '@/utils/request';
import type { DiscoverHotArticleRepsonse, HotType } from './types'

/**
 * 发现热帖
 * @param type 热帖类型 (1:24小时 2:3天 3:15天 4:3个月 5:1年)
 * @param page 页码
 * @param pageSize 页长度
 * @returns 
 */
export const discoverHotArticleAPI = (type: HotType, page: number, pageSize: number) => {
  return request.get<DiscoverHotArticleRepsonse>('/article/hot', {
    params: {
      type,
      limit: pageSize,
      offset: (page - 1) * pageSize
    }
  })
}