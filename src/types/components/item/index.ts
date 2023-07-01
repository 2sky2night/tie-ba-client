import type { ArticleItem } from '@/apis/public/types/article';
import type { BarItem } from '@/apis/public/types/bar';

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

export interface BarItemProps {
  bar:BarItem
}