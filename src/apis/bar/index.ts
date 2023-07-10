import request from '@/utils/request';
import type { BarInfoResponse } from './types';

/**
 * 获取吧的详情数据
 * @param bid 吧的id
 * @returns 吧的详情数据
 */
export const getBarInfoAPI = (bid: number) => {
  return request.get<BarInfoResponse>('/bar/info', {
    params: {
      bid
    }
  })
}

export const getBarArticleAPI = () => {
  return
}