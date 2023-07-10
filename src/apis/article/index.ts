import request from '@/utils/request';
import type { ArticleInfoResponse, SendCommentBody, SendCommentResponse,DeleteCommentResponse } from './types';
import type { CommentListResponse } from '../public/types/article';
import type { UserListResponse } from '../public/types/user'
/**
 * 获取帖子详情列表
 * @param aid 帖子id
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
 * @param desc 降序或升序
 * @param type 排序依据 根据点赞数量排序还是根据创建时间排序 type=1点赞数量 type=2创建时间
 */
export const getArticleCommentAPI = (aid: number, page: number, pageSize: number, desc: boolean,type:1|2) => {
  return request.get<CommentListResponse>('/article/comment/list', {
    params: {
      aid,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      desc: desc ? 1 : 0,
      type
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

/**
 * 删除评论
 * @param cid 评论的id
 * @returns 
 */
export const toDeleteComment = (cid: number) => {
  return request.delete<DeleteCommentResponse>('/article/comment', {
    params:{
      cid
    }
  })
}