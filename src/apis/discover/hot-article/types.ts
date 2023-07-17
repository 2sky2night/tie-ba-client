import type { ArticleItem } from '@/apis/public/types/article';

/**
 * 发现热帖接口的基础响应内容
 */
export interface DiscoverHotArticleRepsonse {
  day: number;
  has_more: boolean;
  limit: number;
  list: ArticleItem[];
  offset: number;
  total: number;
}

/**
 * 热帖类型
 */
export type HotType = 1 | 2 | 3 | 4 | 5