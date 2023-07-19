import { UserBaseItem } from '../types/user';

export type FollowUserResponse = null
export type CancelFollowUserResponse = null

/**
 * 用户简要信息的响应结果
 */
export interface UserCardResponse {
    avatar: string;
    createTime: string;
    fans_count: number;
    follow_count: number;
    is_fans: boolean;
    is_follow: boolean;
    like_count: number;
    uid: number;
    username: string;
    udesc: string;
}

export type UserBaseInfoResponse = UserBaseItem