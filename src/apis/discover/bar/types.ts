import type { BarItem } from '@/apis/public/types/bar';

/**
 * 发现吧的响应结果
 */
export interface DiscoverBarResponse {
  day: number;
  has_more: boolean;
  limit: number;
  list: BarItem[];
  offset: number;
  total: number;
}


/**
 * 热帖类型
 */
export type HotType = 1 | 2 | 3 | 4 | 5