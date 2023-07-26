import type { BarBriefInfo } from './bar';
import type { UserBaseItem, UserBrieflyInfo } from './user';
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
 * 评论项 不包括回复
 */
export interface CommentItemWithout {
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
 * 评论项信息
 */
export interface CommentItem extends CommentItemWithout {
  reply: {
    list: ReplyItem[];
    total: number;
  };
}


/**
 * 回复项
 */
export interface ReplyItem {
  cid: number;
  content: string;
  createTime: string;
  id: number;
  is_liked: boolean;
  like_count: number;
  /**
   * 对回复的回复信息
   */
  reply?: ReplyReplyItem;
  rid: number;
  /**
   * 回复类别 1是回复评论 2是对回复进行回复
   */
  type: 1 | 2;
  uid: number;
  user: UserBaseItem;
}

/**
 * 回复的回复数据
 */
export interface ReplyReplyItem {
  cid: number;
  content: string;
  createTime: string;
  id: number;
  rid: number;
  /**
   * 回复类别 1是回复评论 2是对回复进行回复
   */
  type: 1 | 2;
  uid: number;
  user: UserBaseItem;
}

/**
 * 帖子列表的响应结果
 */
export type ArticleListResponse = ListResponse<ArticleItem>

/**
 * 评论列表的响应结果
 */
export type CommentListResponse = ListResponse<CommentItem>