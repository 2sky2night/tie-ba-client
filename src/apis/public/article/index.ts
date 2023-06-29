import request from '@/utils/request';
import type { LikeArticleResponse,CancelLikeArticleResponse,StarArticleResponse,CancelStarArticleResponse } from './types';

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