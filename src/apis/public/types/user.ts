import { ListResponse } from ".";

/**
 * 用户文章数据
 */
export interface UserArticleCount {
    article_count: number;
    article_like_count: number;
    article_liked_count: number;
    article_star_count: number;
    article_stared_count: number;
}

/**
 * 用户吧数据
 */
export interface UserBarCount {
    create_bar_count: number;
    follow_bar_count: number;
}

/**
 * 用户评论数据
 */
export interface UserCommentCount {
    comment_count: number;
    comment_like_count: number;
    comment_liked_count: number;
}

/**
 * 用户基础信息
 */
export interface UserBaseItem {
    avatar: string;
    createTime: string;
    uid: number;
    username: string;
}


/**
 * 用户简要信息
 */
export interface UserBrieflyInfo extends UserBaseItem {
    is_fans: boolean;
    is_followed: boolean;
}

/**
 * 用户信息
 */
export interface UserItem extends UserBrieflyInfo {
    article_count: number;
    fans_count: number;
    follow_bar_count: number;
    follow_user_count: number;
    create_bar_count: number;
}

/**
 * 用户列表的响应结果
 */
export type UserListResponse = ListResponse<UserItem>