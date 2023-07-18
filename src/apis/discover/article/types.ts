import type { ArticleListResponse } from '@/apis/public/types/article';
import type { UserBaseItem } from '@/apis/public/types/user';

/**
 * 发现帖子接口的基础响应内容
 */
export type DiscoverArticleResponse = ArticleListResponse

/**
 * 发现用户的响应结果
 */
export interface DiscoverUserResponse {
  list: UserBaseItem[];
  total: number;
}


/**
 * 发现类型 (1:24小时 2:3天 3:15天 4:3个月 5:1年) 
 */
export type HotType = 1 | 2 | 3 | 4 | 5