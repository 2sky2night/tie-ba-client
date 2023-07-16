import request from "@/utils/request";
import type { SearchType } from "./types";

/**
 * 搜索
 * @param keywords 搜索关键词 
 * @param type 搜索类型 1搜索帖子标题、2搜索帖子内容、3搜索吧、4搜索评论、5搜索用户、6搜索帖子（包含了标题和内容），默认6
 * @param page 页码
 * @param pageSize 页长度 
 * @param desc 根据创建时间升序或降序
 * @returns 
 */
export const toSearchAPI = <T>(keywords: string, type: SearchType, page: number, pageSize: number, desc: boolean) => {
  return request.get<T>('/search', {
    params: {
      type,
      keywords,
      desc: desc ? 1 : 0,
      limit: pageSize,
      offset: (page - 1) * pageSize
    }
  })
}