import type { UserArticleCount, UserBarCount, UserCommentCount } from '@/apis/public/types/user'

/**
 * 用户信息响应结果
 */
export interface UserProfileResponse {
    article: UserArticleCount;
    avatar: string;
    bar: UserBarCount;
    comment: UserCommentCount;
    createTime: string;
    /**
     * 粉丝数量
     */
    fans_count: number;
    /**
     * 关注数量
     */
    follow_count: number;
    /**
     * 他是不是你的粉丝
     */
    is_fans: boolean;
    /**
     * 是否关注
     */
    is_followed: boolean;
    uid: number;
    username: string;
    udesc: string;
}
