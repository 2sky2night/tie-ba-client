import type { BarItem,BarListResponse } from '@/apis/public/types/bar';

/**
 * 发现吧的响应结果
 */
export interface DiscoverBarResponse extends BarListResponse{
  day: number;
}


/**
 * 热帖类型
 */
export type HotType = 1 | 2 | 3 | 4 | 5