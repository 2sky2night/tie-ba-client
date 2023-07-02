import request from '@/utils/request';
import type { FollowUserResponse, CancelFollowUserResponse, UserCardResponse } from './types';
import type { ArticleListResponse } from '../types/article';
import type { BarListResponse } from '../types/bar';
import type { UserListResponse } from '../types/user';

/**
 * 关注用户
 * @param uid 用户的id 
 * @returns 
 */
export const followUserAPI = (uid: number) => {
  return request.get<FollowUserResponse>('/user/follow', {
    params: {
      uid
    }
  })
}

/**
 * 取消关注用户
 * @param uid 用户的id
 * @returns 
 */
export const cancelFollowUserAPI = (uid: number) => {
  return request.delete<CancelFollowUserResponse>('/user/follow', {
    params: {
      uid
    }
  })
}

/**
 * 获取用户发送的帖子列表
 * @param uid 用户id
 * @param page 页码
 * @param pageSize 每页多少项
 * @param desc 根据创建时间降序
 * @returns 
 */
export const getUserPostArticleListAPI = (uid: number, page: number, pageSize: number, desc: boolean) => {
  return request.get<ArticleListResponse>('/article/user/list', {
    params: {
      uid,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      desc: desc ? 1 : 0
    }
  })
}

/**
 * 获取用户点赞的帖子列表
 * @param uid 用户id
 * @param page 页码
 * @param pageSize 每页多少项
 * @param desc 根据点赞时间降序
 * @returns 
 */
export const getUserLikeArticleListAPI = (uid: number, page: number, pageSize: number, desc: boolean) => {
  return request.get<ArticleListResponse>('/article/user/like/list', {
    params: {
      uid,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      desc: desc ? 1 : 0
    }
  })
}

/**
 * 获取用户收藏的帖子列表
 * @param uid 用户id
 * @param page 页码
 * @param pageSize 每页多少项
 * @param desc 根据收藏时间降序
 * @returns 
 */
export const getUserStarArticleListAPI = (uid: number, page: number, pageSize: number, desc: boolean) => {
  return request.get<ArticleListResponse>('/article/user/star/list', {
    params: {
      uid,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      desc: desc ? 1 : 0
    }
  })
}

/**
 * 获取用户关注的吧
 * @param uid 用户id
 * @param page 页码
 * @param pageSize 每页多少项
 * @param desc 根据收藏时间降序
 * @returns 
 */
export const getUserFollowBarListAPI = (uid: number, page: number, pageSize: number, desc: boolean) => {
  return request.get<BarListResponse>('/bar/user/follow/list', {
    params: {
      uid,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      desc: desc ? 1 : 0
    }
  })
}

/**
 * 获取用户创建的吧
 * @param uid 用户id
 * @param page 页码
 * @param pageSize 每页多少项
 * @param desc 根据收藏时间降序
 * @returns 
 */
export const getUserCreateBarListAPI = (uid: number, page: number, pageSize: number, desc: boolean) => {
  return request.get<BarListResponse>('/bar/user/list', {
    params: {
      uid,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      desc: desc ? 1 : 0
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
 * 获取用户简要信息
 * @param uid 用户id
 * @returns 
 */
export const getUserBrieflyInfoAPI = (uid: number) => {
  return request.get<UserCardResponse>('/user/card', {
    params: {
      uid
    }
  })
}