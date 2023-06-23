import request from '@/utils/request';
import type { LoginResponse, LoginBody } from './types'

/**
 * 登录
 * @param data 登录的请求体 
 * @returns 登录成功的结果 
 */
export const loginAPI = (data: LoginBody) => {
  return request.post<LoginResponse>('/user/login', data)
}

