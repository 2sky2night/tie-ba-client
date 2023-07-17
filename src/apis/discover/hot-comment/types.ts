import type { CommentItem } from '@/apis/public/types/article';

/**
 * 发现热评的响应结果
 */
export interface DiscoverHotCommentResponse {
  day: number;
  has_more: boolean;
  limit: number;
  list: CommentItem[];
  offset: number;
  total: number;
}

/**
 * 热吧类型
 */
export type HotType = 1 | 2 | 3 | 4 | 5