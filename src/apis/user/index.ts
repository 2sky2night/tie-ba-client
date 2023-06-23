import type { UserProfileResponse } from './types'
import request from '@/utils/request'

/**
 * 通过查询参数获取用户详情信息
 * @param uid 用户详情信息
 * @returns 
 */
export const getUserProfileAPI = (uid: number) => {
    return request.get<UserProfileResponse>('/user/profile', {
        params: {
            uid
        }
    })
}