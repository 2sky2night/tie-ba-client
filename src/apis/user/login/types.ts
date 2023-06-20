/**
 * 登录成功的响应结果
 */
export type LoginResponse = string
/**
 * 登录时发送的请求体
 */
export interface LoginBody {
  password: string;
  username: string;
}