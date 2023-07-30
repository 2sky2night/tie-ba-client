import request from '@/utils/request';
import type { BarInfoResponse, EditBarBody, EditBarResponse, UserSignInResponse, BarRankRuleResponse,EditBarRankResponse,EditBarRankRuleBody } from './types';
import type { ArticleListResponse } from '../public/types/article';
import type { UserListResponse } from '../public/types/user';

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

/**
 * 获取吧的帖子
 * @param bid 吧的id
 * @param page 页码
 * @param pageSize 页长度 
 * @param desc 是否降序
 * @param type 排序依据
 * @returns 
 */
export const getBarArticleAPI = (bid: number, page: number, pageSize: number, desc: boolean, type: 1 | 2) => {
  return request.get<ArticleListResponse>('/bar/article/list', {
    params: {
      bid,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      desc: desc ? 1 : 0,
      type
    }
  })
}

/**
 * 获取关注吧的用户列表
 * @param bid 吧id
 * @param page 页码
 * @param pageSize 页长度
 * @param desc 关注时间降序
 * @returns 
 */
export const getBarFollowUserAPI = (bid: number, page: number, pageSize: number, desc: boolean) => {
  return request.get<UserListResponse>('/bar/follow/list', {
    params: {
      bid,
      desc: desc ? 1 : 0,
      offset: (page - 1) * pageSize,
      limit: pageSize
    }
  })
}

/**
 * 编辑吧信息
 * @param data 
 * @returns 
 */
export const editBarInfoAPI = (data: EditBarBody) => {
  return request.put<EditBarResponse>('/bar/edit',data)
}

/**
 * 用户签到吧
 * @param bid 吧id
 * @returns 
 */
export const signInBarAPI = (bid: number) => {
  return request.get<UserSignInResponse>('/bar/signIn', {
    params: {
      bid
    }
  })
}

/**
 * 获取吧等级制度信息
 * @param bid 吧id
 * @returns 
 */
export const getBarRankRuleAPI = (bid: number) => {
  return request.get<BarRankRuleResponse>('/bar/rank/info', {
    params: {
      bid
    }
  })
}

/**
 * 编辑吧等级头衔昵称
 * @param data 头衔昵称列表
 * @returns 
 */
export const editBarBankRuleAPI = (data: EditBarRankRuleBody) => {
  return request.put<EditBarRankResponse>('/bar/edit/rank',data)
}