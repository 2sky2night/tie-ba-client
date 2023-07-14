import type { BarBase } from '../public/types/bar';
import type { ListResponse } from '../public/types';
/**
 * 获取用户关注的吧列表的响应结果
 */
export type UserFollowBarListResponse = ListResponse<BarBase>

/**
 * 获取所有吧列表的响应结果
 */
export type AllBarListResponse = ListResponse<BarBase>

/**
 * 发送吧的响应结果
 */
export type PostArticleResponse = null

/**
 * 发帖的请求体
 */
export interface PostArticleBody {
  /**
   * 吧id
   */
  bid: null|number;
  /**
   * 帖子主要内容
   */
  content: string;
  /**
   * 帖子的配图
   */
  photo: string[] | null;
  /**
   * 帖子标题
   */
  title: string;
}

