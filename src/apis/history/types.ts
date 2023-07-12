import type { ArticleItem } from '../public/types/article';

export interface HistoryArticleRespsone {
  list: ArticleItem[];
  total: number;
}