import type { BarBriefInfo } from './bar';
import type { UserBrieflyInfo } from './user';
import type { ListResponse } from '.';
/**
 * 帖子项信息
 */
export interface ArticleItem {
  aid: number;
  bar: BarBriefInfo;
  bid: number;
  comment_count: number;
  content: string;
  createTime: string;
  is_liked: boolean;
  is_star: boolean;
  like_count: number;
  photo: string[] | null;
  star_count: number;
  title: string;
  uid: number;
  user: UserBrieflyInfo;
}


/**
 * 评论项信息
 */
export interface CommentItem {
  aid: number;
  cid: number;
  content: string;
  createTime: string;
  is_liked: boolean;
  like_count: number;
  photo: string[] | null;
  uid: number;
  user: UserBrieflyInfo;
}


/**
 * 帖子列表的响应结果
 */
export type ArticleListResponse = ListResponse<ArticleItem>

/**
 * 评论列表的响应结果
 */
export type CommentListResponse = ListResponse<CommentItem>