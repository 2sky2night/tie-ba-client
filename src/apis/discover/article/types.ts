import type { ArticleItem } from '@/apis/public/types/article';
import type { UserBaseItem } from '@/apis/public/types/user';

/**
 * 发现帖子接口的基础响应内容
 */
export interface DiscoverArticleResponse {
  has_more: boolean;
  limit: number;
  list: ArticleItem[];
  offset: number;
  total: number;
}

/**
 * 发现用户的响应结果
 */
export interface DiscoverUserResponse {
  list: UserBaseItem[];
  total: number;
}