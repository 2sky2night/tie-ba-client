import request from '@/utils/request';
import type { ArticleInfoResponse, SendCommentBody,SendCommentResponse } from './types';

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

export const commentArticleAPI = (data:SendCommentBody) => {
  return request.post<SendCommentResponse>('/article/comment', data)
}