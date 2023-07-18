import type { ArticleItem,ArticleListResponse } from '@/apis/public/types/article';

/**
 * 发现热帖接口的基础响应内容
 */
export interface DiscoverHotArticleRepsonse extends ArticleListResponse {
  day: number;
}

/**
 * 热帖类型 (1:24小时 2:3天 3:15天 4:3个月 5:1年) 
 */
export type HotType = 1 | 2 | 3 | 4 | 5