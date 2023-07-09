import request from '@/utils/request';
import type { ArticleInfoResponse, SendCommentBody, SendCommentResponse } from './types';
import type { CommentListResponse } from '../public/types/article';
import type { UserListResponse } from '../public/types/user'
/**
 * 获取帖子详情列表
 * @param aid 
 * @returns 
 */
export const getArticleInfoAPI = (aid: number) => {
  return request.get<ArticleInfoResponse>('/article/info', {
    params: {
      aid
    }
  })
}

/**
 * 发送评论
 * @param data 发送评论请求体
 * @returns 
 */
export const commentArticleAPI = (data: SendCommentBody) => {
  return request.post<SendCommentResponse>('/article/comment', data)
}

/**
 * 获取帖子的评论列表
 * @param aid 帖子id
 * @param page 页码
 * @param pageSize 页长度
 */
export const getArticleCommentAPI = (aid: number, page: number, pageSize: number, desc: boolean) => {
  return request.get<CommentListResponse>('/article/comment/list', {
    params: {
      aid,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      desc: desc ? 1 : 0
    }
  })
}

/**
 * 获取点赞帖子的用户
 * @param aid 帖子aid
 * @param page 页码
 * @param pageSize 页长度
 * @param desc 根据点赞时间降序
 * @returns 
 */
export const getArticleLikedListAPI = (aid: number, page: number, pageSize: number, desc: boolean) => {
  return request.get<UserListResponse>('/article/liked/list', {
    params: {
      aid,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      desc: desc ? 1 : 0
    }
  })
}

/**
 * 获取点赞帖子的用户
 * @param aid 帖子aid
 * @param page 页码
 * @param pageSize 页长度
 * @param desc 根据点赞时间降序
 * @returns 
 */
export const getArticleStarListAPI = (aid: number, page: number, pageSize: number, desc: boolean) => {
  return request.get<UserListResponse>('/article/star/list', {
    params: {
      aid,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      desc: desc ? 1 : 0
    }
  })
}