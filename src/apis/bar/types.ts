import { UserBaseItem, UserBrieflyInfo } from '../public/types/user';
import type { BarRankInfo } from '../public/bar/types';
import type { BarBase, BarRank } from '../public/types/bar';


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
 * 吧等级排行项
*/
export interface BarRankingItem {
  bar_rank: BarRank;
  bid: number;
  is_checked: number;
  /**
   * 该用户的排名
   */
  ranking: number;
  score: number;
  uid: number;
  user: UserBaseItem;
}

/**
 * 吧人数等级分布项
 */
export interface BarDistributionItem {
  count: number;
  /**
   * 当前用户是否在这个分区
   */
  current_uid_in: boolean;
  label: string;
  level: number;
}

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
 * 获取吧等级排行榜的响应结果
 */
export interface BarRankingResponse {
  desc: boolean;
  has_more: boolean;
  limit: number;
  list: BarRankingItem[];
  /**
   * 当前用户的排名 未登录或未关注返回null
   */
  my_bar_rank_info: {
    label: string;
    level: number;
    progress: number;
    /**
     * 我的排名
     */
    ranking: number;
    score: number;
  } | null;
  offset: number;
  total: number;
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
 * 编辑吧等级的响应结果
*/
export type EditBarRankResponse = null


/**
 * 吧等级分布的响应结果
 */
export interface BarDistributionResponse extends BarBase {
  /**
   * 分布数据
   */
  list: BarDistributionItem[];
  /**
   * 总共多少个人在此吧
   */
  total: number;
}