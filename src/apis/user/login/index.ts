import request from '@/utils/request';
import type {LoginResponse,LoginBody,RegisterBody,RegisterResponse } from './types'

/**
 * 登录
 * @param data 登录的请求体 
 * @returns 登录成功的结果 
 */
export const LoginAPI = (data:LoginBody) => {
  return request.post<LoginResponse>('/user/login',data)
}

/**
 * 用户注册
 * @param data 注册的请求体 
 * @returns 注册成功的结果
 */
export const RegisterAPI = (data: RegisterBody) => {
  return request.post<RegisterResponse>('/user/register',data)
}