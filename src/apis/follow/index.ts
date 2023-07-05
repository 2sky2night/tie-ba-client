import request from '@/utils/request'
import { UserListResponse } from '@/apis/public/types/user'

/**
 * 搜索用户关注列表
 * @param uid 用户id
 * @param keywords 关键词
 * @param page 页码
 * @param pageSize 页长度
 * @returns 
 */
export const searchUserFollowListAPI = (uid: number, keywords: string, page: number, pageSize: number) => {
  return request.get<UserListResponse>('/search/user/follow', {
    params: {
      uid,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      keywords
    }
  })
}


/**
 * 获取用户关注列表
 * @param uid 用户列表
 * @param page 页码
 * @param pageSize 每页长度
 * @param desc 是否根据关注时间降序
 * @returns 
 */
export const getUserFollowListAPI = (uid: number, page: number, pageSize: number, desc: boolean) => {
  return request.get<UserListResponse>('/user/follow/list', {
    params: {
      uid,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      desc:desc?1:0
    }
  })
}