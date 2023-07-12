import request from '@/utils/request';
import type { HistoryArticleRespsone } from './types'

/**
 * 获取浏览的历史记录
 * @param aids 
 * @returns 
 */
export const getHistoryArticleAPI = (aids: string) => {
  return request.get<HistoryArticleRespsone>('/article/list/aids', {
    params: {
      aids
    }
  })
}