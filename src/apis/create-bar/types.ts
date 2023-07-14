/**
 * 创建吧的请求体
 */
export interface CreateBarBody {
  /**
   * 吧的描述
   */
  bdesc: string;
  /**
   * 吧名
   */
  bname: string;
  /**
   * 吧的头像
   */
  photo: string;
}

/**
 * 创建吧的响应结果
 */
export type CreateBarResponse = null;