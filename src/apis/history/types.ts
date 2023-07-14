import type { ArticleItem } from '../public/types/article';

/**
 * 历史记录响应的结果
 */
export interface HistoryArticleRespsone {
  list: (ArticleItem|EmptyArticleItem)[];
  total: number;
}

/**
 * 空帖子项
 */
export interface EmptyArticleItem {
  aid: number;
  not_found:true
}