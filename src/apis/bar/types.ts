import { UserBrieflyInfo } from '../public/types/user';
import type { BarRankInfo } from '../public/bar/types';
/**
 * 获取吧详情信息的响应结果
 */
export interface BarInfoResponse {
  article_count: number;
  bdesc: string;
  bid: number;
  bname: string;
  createTime: string;
  /**
   * 是否签到
   */
  is_checked: boolean;
  is_followed: boolean;
  /**
   * 当前用户吧等级信息 未登录响应null
   */
  my_bar_rank: BarRankInfo | null;
  photo: string;
  uid: number;
  /**
   * 吧主信息
   */
  user: UserBrieflyInfo;
  user_follow_count: number;
}

/**
 * 编辑吧的请求体
 */
export interface EditBarBody {
  bid: number;
  bname: string;
  bdesc: string;
  photo: string;
}

/**
 * 编辑吧成功的响应结果
 */
export type EditBarResponse = null

/**
 * 用户签到后的响应结果
 */
export interface UserSignInResponse {
  /**
   * 当前等级
   */
  level: number;
  /**
   * 等级昵称
   */
  label: string;
  /**
   * 经验
   */
  score: number;
  /**
   * 经验进度
   */
  progress: number;
}

/**
 * 吧等级制度的响应结果
 */
export interface BarRankRuleResponse {
  bdesc: string;
  bid: number;
  bname: string;
  createTime: string;
  photo: string;
  rank_rules: BarRankItem[];
  uid: number;
}

/**
 * 吧等级规则项
 */
export interface BarRankItem {
  /**
   * 等级
   */
  level: number;
  /**
   * 等级昵称
   */
  label: string;
  /**
   * 对应所需的经验
   */
  score: number;
}

/**
 * 编辑吧的请求体
 */
export interface EditBarRankRuleBody {
  bid: number;
  /**
   * 等级头衔昵称列表
   */
  rankLableList: string[];
}

/**
 * 编辑吧等级的响应结果
 */
export type EditBarRankResponse = null