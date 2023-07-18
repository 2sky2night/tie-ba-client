import request from '@/utils/request';
import type { DiscoverUserResponse, DiscoverArticleResponse,HotType } from './types'

/**
 * 发现用户（最近那些关注了的用户发了贴）
 */
export const discoverUserAPI = (type:HotType) => {
  return request.get<DiscoverUserResponse>('/user/discover', {
    params: {
      type
    }
  })
}

/**
 * 发现帖子(所有关注者发送的帖子)
 * @param page 页码
 * @param pageSize 页长度
 */
export const discoverArticleAPI = (page: number, pageSize: number) => {
  return request.get<DiscoverArticleResponse>('/article/discover', {
    params: {
      offset: (page - 1) * pageSize,
      limit: pageSize
    }
  })
}