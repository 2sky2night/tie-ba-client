/**
 * 基础请求响应体
 */
export default interface BaseResponse<T = any> {
  /**
 * 请求的结果
 */
  data: T
  /**
   * 业务状态码
   */
  code: number;
  /**
   * 提示信息
   */
  message: string;
}
