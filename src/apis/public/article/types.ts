import type { CommentItemWithout, ReplyItem } from '../types/article'
/**
 * 点赞帖子的响应结果
 */
export type LikeArticleResponse = null

/**
 * 取消点赞帖子的响应结果
 */
export type CancelLikeArticleResponse = null

/**
 * 收藏帖子的响应结果
 */
export type StarArticleResponse = null

/**
 * 取消收藏帖子的响应结果
 */
export type CancelStarArticleResponse = null

/**
 * 取消点赞评论的响应结果
 */
export type CancelLikeCommentResponse = null

/**
 * 点赞评论的响应结果
 */
export type LikeCommentResponse = null

/**
 * 取消点赞回复的响应结果
 */
export type CancelLikeReplyRepsonse = null
/**
 * 点赞回复的响应结果
 */
export type LikeReplyRepsonse = null

/**
 * 获取评论的回复响应结果
 */
export interface ReplyListResponse {
  comment: CommentItemWithout;
  has_more: boolean;
  limit: number;
  list: ReplyItem[];
  offset: number;
  total: number;
}

/**
 * 发送回复成功后的响应体
 */
export type SendReplyResponse = null

/**
 * 发送回复的请求体
 */
export interface SendReplyBody {
  /**
 * 回复所属的评论id
 */
  cid: number;
  /**
   * 回复内容
   */
  content: string;
  /**
   * 回复对象的id
   */
  id: number;
  /**
   * 回复类型，1对评论进行恢复，2对回复进行恢复
   */
  type: number;
}