import request from "@/utils/request";
import type { FollowBarResponse,CancelFollowBarResponse } from "./types";
/**
 * 关注吧
 * @param bid 吧id
 * @returns 
 */
export const followBarAPI = (bid: number) => {
    return request.get<FollowBarResponse>('/bar/follow', {
        params: {
            bid
        }
    })
}

/**
 * 取消关注吧
 * @param bid  吧id
 * @returns 
 */
export const cancelFollowBarAPI = (bid: number) => {
    return request.delete<CancelFollowBarResponse>('/bar/follow', {
        params: {
            bid
        }
    })
}