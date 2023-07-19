/**
 * 编辑用户信息的请求体
 */
export interface EditUserInfoBody {
  username: string;
  avatar: string;
  udesc: string;
}

/**
 * 编辑用户信息的响应结果
 */
export type EditUserInfoResponse = null

/**
 * 编辑用户密码的请求体
 */
export interface EditUserPasswordBody {
  password: string;
  oldPassword: string;
}

export type EditUserPasswordResponse = null