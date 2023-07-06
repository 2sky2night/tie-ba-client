import request from '@/utils/request';
import { ArticleListResponse } from '../public/types/article';

/**
 * 获取帖子列表
 * @param page 页码
 * @param pageSize 页长度
 * @param desc 降序或升序
 * @returns 
 */
export const getArticleListAPI = (page: number, pageSize: number, desc: boolean) => {
  return request.get<ArticleListResponse>('/article/list', {
    params: {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      desc: desc ? 1 : 0
    }
  })
}