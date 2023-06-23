import type { UserInfoResponse } from './types'
import request from '@/utils/request'

/**
 * 获取我的详情信息
 * @returns 
 */
export const getUserInfoAPI = () => {
    return request.get<UserInfoResponse>('/user/info/v2')
}