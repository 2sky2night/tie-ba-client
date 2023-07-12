import request from '@/utils/request';
import type { EditUserInfoBody, EditUserInfoResponse, EditUserPasswordBody, EditUserPasswordResponse } from './types'

/**
 * 编辑用户信息
 * @param data 用户信息
 * @returns 
 */
export const editUserInfoAPI = (data: EditUserInfoBody) => {
  return request.put<EditUserInfoResponse>('/user/info', data)
}

/**
 * 编辑用户密码
 * @param data 用户密码
 * @returns 
 */
export const editUserPasswordAPI = (data: EditUserPasswordBody) => {
  return request.put<EditUserPasswordResponse>('/user/info/password', data)
}