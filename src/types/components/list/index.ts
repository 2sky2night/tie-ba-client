import type { ArticleListResponse } from "@/apis/public/types/article";
import type { BarListResponse } from "@/apis/public/types/bar";

/**
 * 无限加载帖子组件的props
 */
export interface ArticleListLoadProps {
  /**
   * 获取帖子列表的处理函数
   */
  getDataCb: (page: number, pageSize: number, desc: boolean) => Promise<ArticleListResponse>;
  /**
   * 是否控制每页长度
   */
  ctPageSize?: boolean;
  /**
   * 是否控制帖子的排序
   */
  ctDesc?: boolean;
  /**
   * pageSizes
   */
  pageSizes?: number[];
}

/**
 * 无限加载的吧列表组件的props
 */
export interface BarListLoadProps {
  /**
   * 获取吧列表的函数
   */
  getDataCb: (page: number, pageSize: number, desc: boolean) => Promise<BarListResponse>;
}