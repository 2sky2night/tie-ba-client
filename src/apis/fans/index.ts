import request from '@/utils/request'
import { UserListResponse } from '@/apis/public/types/user'

/**
 * 获取用户粉丝列表
 * @param uid 用户列表
 * @param page 页码
 * @param pageSize 每页长度
 * @param desc 是否根据记录时间降序
 * @returns 
 */
export const getUserFansListAPI = (uid: number, page: number, pageSize: number, desc: boolean) => {
  return request.get<UserListResponse>('/user/fans/list', {
    params: {
      uid,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      desc: desc ? 1 : 0
    }
  })
}

/**
 * 搜索用户粉丝列表
 * @param uid 用户id
 * @param keywords 关键词
 * @param page 页码
 * @param pageSize 页长度
 * @returns 
 */
export const searchUserFansListAPI = (uid: number, keywords: string, page: number, pageSize: number) => {
  return request.get<UserListResponse>('/search/user/fans', {
    params: {
      uid,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      keywords
    }
  })
}