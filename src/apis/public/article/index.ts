import request from '@/utils/request';
import { CancelLikeCommentResponse, LikeCommentResponse, LikeArticleResponse, CancelLikeArticleResponse, StarArticleResponse, CancelStarArticleResponse, ReplyListResponse, LikeReplyRepsonse, CancelLikeReplyRepsonse,SendReplyBody,SendReplyResponse } from './types';

/**
 * 点赞帖子
 * @param aid 帖子的id 
 * @returns 
 */
export const likeArticleAPI = (aid: number) => {
  return request.get<LikeArticleResponse>('/article/like', {
    params: {
      aid
    }
  })
}

/**
 * 取消点赞帖子
 * @param aid 帖子id
 * @returns 
 */
export const cancelLikeArticleAPI = (aid: number) => {
  return request.delete<CancelLikeArticleResponse>('/article/like', {
    params: {
      aid
    }
  })
}

/**
 * 收藏帖子
 * @param aid 
 * @returns 
 */
export const starArticleAPI = (aid: number) => {
  return request.get<StarArticleResponse>('/article/star', {
    params: {
      aid
    }
  })
}

/**
 * 取消收藏帖子
 * @param aid 帖子id
 * @returns 
 */
export const cancelStarArticleAPI = (aid: number) => {
  return request.delete<CancelStarArticleResponse>('/article/star', {
    params: {
      aid
    }
  })
}

/**
 * 点赞评论
 * @param cid 评论id 
 * @returns 
 */
export const likeCommentAPI = (cid: number) => {
  return request.get<LikeCommentResponse>('/article/comment/like', {
    params: {
      cid
    }
  })
}

/**
 * 取消点赞评论 
 * @param cid 评论id 
 * @returns 
 */
export const cancelLikeCommentAPI = (cid: number) => {
  return request.delete<CancelLikeCommentResponse>('/article/comment/like', {
    params: {
      cid
    }
  })
}

/**
 * 获取评论的回复
 * @param cid 评论id
 * @param page 页码
 * @param pageSize 页长度
 * @returns 
 */
export const getCommentReplyAPI = (cid: number, page: number, pageSize: number) => {
  return request.get<ReplyListResponse>('/article/reply/list', {
    params: {
      cid,
      offset: (page - 1) * pageSize,
      limit: pageSize
    }
  })
}

/**
 * 点赞回复
 * @param rid 回复的id 
 * @returns 
 */
export const likeReplyAPI = (rid: number) => {
  return request.get<LikeReplyRepsonse>('/article/reply/like', {
    params: {
      rid
    }
  })
}

/**
 * 取消点赞回复
 * @param rid 回复的id
 * @returns 
 */
export const cancelLikeReplyAPI = (rid: number) => {
  return request.delete<CancelLikeReplyRepsonse>('/article/reply/like', {
    params: {
      rid
    }
  })
}

/**
 * 发送回复
 * @param data 请求体
 * @returns 
 */
export const sendReplyAPI = (data: SendReplyBody) => {
  return request.post<SendReplyResponse>('/article/reply',data)
}