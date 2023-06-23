import request from '@/utils/request';
import type { RegisterBody, RegisterResponse } from './types'


/**
 * 用户注册
 * @param data 注册的请求体 
 * @returns 注册成功的结果
 */
export const registerAPI = (data: RegisterBody) => {
    return request.post<RegisterResponse>('/user/register', data)
}