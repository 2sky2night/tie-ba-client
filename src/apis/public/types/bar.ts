import type { UserBrieflyInfo } from './user';
import type { ListResponse } from '.';
/**
 * 吧的简要信息
 */
export interface BarBriefInfo extends BarBase{
  is_followed: boolean;
}

/**
 * 吧列表中的每一项
 */
export interface BarItem extends BarBriefInfo{
  article_count: number;
  user: UserBrieflyInfo;
  user_follow_count: number;
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