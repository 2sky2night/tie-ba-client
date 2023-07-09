import type { UserBrieflyInfo } from '../public/types/user';
import type { BarBase } from '../public/types/bar';

/**
 * 获取帖子详情的响应结果
 */
export interface ArticleInfoResponse {
  aid: number;
  bar: BarBase;
  bid: number;
  comment_count: number;
  content: string;
  createTime: string;
  is_liked: boolean;
  is_star: boolean;
  like_count: number;
  photo: null;
  star_count: number;
  title: string;
  uid: number;
  user: UserBrieflyInfo;
}

/**
 * 发送评论的请求体
 */
export interface SendCommentBody {
  aid: number;
  content: string;
  photo: string[] | null
}

/**
 * 发送评论的响应结果
 */
export type SendCommentResponse = null