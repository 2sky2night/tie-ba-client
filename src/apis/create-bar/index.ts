import type {CreateBarBody,CreateBarResponse} from './types'
import request from '@/utils/request'

/**
 * 创建吧
 * @param data 创建吧所需的请求体
 * @returns 
 */
export const createBarAPI = (data: CreateBarBody) => {
  return request.post<CreateBarResponse>('/bar/create',data)
}