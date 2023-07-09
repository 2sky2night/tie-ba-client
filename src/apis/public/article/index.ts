import request from '@/utils/request';
import type { CancelLikeCommentResponse,LikeCommentResponse,LikeArticleResponse,CancelLikeArticleResponse,StarArticleResponse,CancelStarArticleResponse } from './types';

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