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

/**
 * 注册时发送的请求体
 */
export type RegisterBody = LoginBody

/**
 * 注册成功的响应结果
 */
export type RegisterResponse = null