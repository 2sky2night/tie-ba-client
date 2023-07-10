import { UserBrieflyInfo } from '../public/types/user';

/**
 * 获取吧详情信息的响应结果
 */
export interface BarInfoResponse {
  article_count: number;
  bdesc: string;
  bid: number;
  bname: string;
  createTime: string;
  is_followed: boolean;
  photo: string;
  uid: number;
  user: UserBrieflyInfo;
  user_follow_count: number;
}