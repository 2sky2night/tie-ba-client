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