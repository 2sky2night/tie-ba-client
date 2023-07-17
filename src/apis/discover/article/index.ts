import request from '@/utils/request';
import type {DiscoverUserResponse,DiscoverArticleResponse} from './types'

/**
 * 发现用户（最近那些关注了的用户发了贴）
 */
export const discoverUserAPI = () => {
  return request.get<DiscoverUserResponse>('/user/discover')
}

/**
 * 发现帖子(所有关注者发送的帖子)
 * @param page 页码
 * @param pageSize 页长度
 */
export const discoverArticleAPI = (page:number,pageSize:number) => {
  return request.get<DiscoverArticleResponse>('/article/discover', {
    params: {
      offset: (page - 1) * pageSize,
      limit:pageSize
    }
  })
}