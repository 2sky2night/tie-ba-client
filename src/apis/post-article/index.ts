import request from '@/utils/request';
import type { UserFollowBarListResponse, AllBarListResponse,PostArticleBody,PostArticleResponse } from './types'

/**
 * 获取用户关注的吧列表 （仅包含简要信息）
 * @param page 页码
 * @param pageSize 每页长度
 * @param desc 排序方式
 * @returns 
 */
export const getUserFollowBarListAPI = (page: number, pageSize: number, desc: boolean) => {
  return request.get<UserFollowBarListResponse>('/bar/user/list/briefly', {
    params: {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      desc: desc ? 1 : 0
    }
  })
}

/**
 * 获取吧列表 （仅包含简要信息）
 * @param page 页码
 * @param pageSize 每页长度
 * @param desc 排序方式
 * @returns 
 */
export const getAllBarListAPI = (page: number, pageSize: number, desc: boolean) => {
  return request.get<AllBarListResponse>('/bar/all', {
    params: {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      desc: desc ? 1 : 0
    }
  })
}

/**
 * 发帖
 * @param data 
 * @returns 
 */
export const postArticleAPI = (data: PostArticleBody) => {
  return request.post<PostArticleResponse>('/article/post',data)
}