import type {UserArticleCount,UserBarCount,UserCommentCount} from '@/apis/public/types/user'

/**
 * 用户信息模态消息框的props
 */
export default interface UserDataProps {
    article: UserArticleCount,
    bar: UserBarCount,
    comment: UserCommentCount
}