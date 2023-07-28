/**
 * 关注吧的响应结果
 */
export type FollowBarResponse = null

/**
 * 取消关注吧的响应结果
 */
export type CancelFollowBarResponse = null

/**
 * 用户的吧等级信息
 */
export interface BarRankInfo {
  /**
   * 吧等级头衔
   */
  label: string;
  /**
   * 吧等级
   */
  level: number;
  /**
   * 当前等级的比例
   */
  progress: number;
  /**
   * 签到得分
   */
  score: number;
}