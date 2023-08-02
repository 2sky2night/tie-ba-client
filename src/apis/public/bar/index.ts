import request from "@/utils/request";
import type { FollowBarResponse,CancelFollowBarResponse,BarBrieflyResponse } from "./types";
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

/**
 * 获取吧简要数据
 * @param bid 吧id
 * @returns 
 */
export const getBarBriefly = (bid: number) => {
    return request.get<BarBrieflyResponse>('/bar/briefly', {
        params: {
            bid
        }
    })
}