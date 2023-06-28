/**
 * 列表接口的响应结果
 */
export interface ListResponse<T> {
  desc: boolean;
  has_more: boolean;
  limit: number;
  list: T[];
  offset: number;
  total: number;
}