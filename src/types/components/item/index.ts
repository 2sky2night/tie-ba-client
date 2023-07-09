import type { ArticleItem, CommentItem } from '@/apis/public/types/article';
import type { BarItem } from '@/apis/public/types/bar';
import type { UserItem } from '@/apis/public/types/user';

/**
 * 帖子项组件的props
 */
export interface ArticleItemProps {
  article: ArticleItem;
  isLiked: boolean;
  isStar: boolean;
  starCount: number;
  likeCount: number;
}

/**
 * 吧项组件的props
 */
export interface BarItemProps {
  bar:BarItem
}

/**
 * 用户项组件的props
 */
export interface UserItemProps {
  user: UserItem;
  fansCount: number;
}

/**
 * 评论项组件的props
 */
export interface CommentItemProps {
  comment: CommentItem
  isLike: boolean;
  likeCount:number
}