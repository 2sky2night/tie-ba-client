import type { ArticleListResponse, CommentListResponse } from "@/apis/public/types/article";
import type { BarListResponse } from "@/apis/public/types/bar";
import type { UserListResponse } from "@/apis/public/types/user";

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

/**
 * 分页的用户列表组件的Props
 */
export interface UserListPageProps {
  /**
   * 获取数据的函数
   */
  getData: (page: number, pageSize: number) => Promise<UserListResponse>
}

/**
 * 根据主视图滚动条无限加载的帖子列表组件的props
 */
export interface ArticleListLoadInfProps {
  /**
  * 获取数据的函数
  */
  getList: (page: number, pageSize: number) => Promise<ArticleListResponse>;
}
/**
 * 根据主视图滚动条无限加载的评论列表组件的props
 */
export interface CommentListLoadInfProps {
  /**
  * 获取数据的函数
  */
  getData: (page: number, pageSize: number) => Promise<CommentListResponse>
}