import type { BarListResponse } from '@/apis/public/types/bar';

/**
 * 发现吧的响应结果
 */
export interface DiscoverBarResponse extends BarListResponse{
  day: number;
}


/**
 * 热吧类型 (1:24小时 2:3天 3:15天 4:3个月 5:1年) 
 */
export type HotType = 1 | 2 | 3 | 4 | 5