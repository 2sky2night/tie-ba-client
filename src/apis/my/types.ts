import { UserArticleCount, UserBarCount, UserCommentCount } from "../public/types/user";

/**
 * 用户信息
 */
export interface UserInfoResponse {
    article: UserArticleCount;
    avatar: string;
    bar: UserBarCount;
    comment: UserCommentCount;
    createTime: string;
    fans_count: number;
    follow_count: number;
    uid: number;
    username: string;
    udesc: string;
}


