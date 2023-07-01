import type { ArticleItem } from '@/apis/public/types/article';

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