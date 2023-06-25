import request from '@/utils/request';
import type { FollowUserResponse,CancelFollowUserResponse } from './types';

/**
 * 关注用户
 * @param uid 用户的id 
 * @returns 
 */
export const followUserAPI = (uid: number) => {
  return request.get<FollowUserResponse>('/user/follow', {
    params: {
      uid
    }
  })
}

/**
 * 取消关注用户
 * @param uid 用户的id
 * @returns 
 */
export const cancelFollowUserAPI = (uid: number) => {
  return request.delete<CancelFollowUserResponse>('/user/follow', {
    params: {
      uid
    }
  })
}