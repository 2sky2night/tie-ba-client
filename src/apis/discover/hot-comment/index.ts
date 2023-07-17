import request from '@/utils/request';
import type {HotType,DiscoverHotCommentResponse} from './types'


/**
 * 发现热评
 * @param type 热评类型(1:24小时 2:3天 3:15天 4:3个月 5:1年) 
 * @param page 页码
 * @param pageSize 页长度
 */
export const discoverHotComment = (type:HotType,page:number,pageSize:number) => {
  return request.get<DiscoverHotCommentResponse>('/article/comment/discover', {
    params: {
      type,
      limit: pageSize,
      offset:(page-1)*pageSize
    }
  })
}