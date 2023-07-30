import type { UserBrieflyInfo } from './user';
import type { ListResponse } from '.';
/**
 * 吧的简要信息
 */
export interface BarBriefInfo extends BarBase {
  is_followed: boolean;
}

/**
 * 吧列表中的每一项
 */
export interface BarItem extends BarBriefInfo {
  article_count: number;
  user: UserBrieflyInfo;
  user_follow_count: number;
  /**
   * 用户所在的吧等级信息(用户指当前用户或目标用户)
   */
  bar_rank: BarRank | null
}

/**
 * 吧的基础数据
 */
export interface BarBase {
  bdesc: string;
  bid: number;
  bname: string;
  createTime: string;
  photo: string;
  uid: number;
}

/**
 * 吧列表接口的响应结果
 */
export type BarListResponse = ListResponse<BarItem>

/**
 * 用户在吧的等级信息
 */
export interface BarRank {
  /**
   * 头衔昵称
   */
  label: string;
  /**
   * 等级
   */
  level: number;
  /**
   * 经验
   */
  score: number;
  /**
   * 距离下一级经验的百分比
   */
  progress: number
}