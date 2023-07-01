import { Size } from "naive-ui/es/button/src/interface";
import type { UserArticleCount, UserBarCount, UserCommentCount } from '@/apis/public/types/user'


/**
 * 关注用户按钮props
 */
export interface FollowBtnProps {
    /**
     * 是否关注
     */
    isFollowed: boolean;
    /**
     * 他关注我了吗
     */
    isFans: boolean;
    /**
     * 目标用户id
     */
    uid: number;
    /**
     * 按钮大小
     */
    size: Size
}


/**
 * 用户信息模态消息框的props
 */
export interface UserDataProps {
    article: UserArticleCount,
    bar: UserBarCount,
    comment: UserCommentCount
}

/**
 * 用户收藏、发送、点赞帖子等数据展示组件的自定义属性
 */
export interface UserViewsProps {
    /**
     * 用户的id
     */
    uid: number;
}

/**
 * 图片预览组件
 */
export interface ImgPreviewProps {
    /**
     * 图片链接
     */
    src: string;
    /**
     * 销毁图片预览组件
     * @returns 
     */
    toClose:()=>void
}