export {}

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 需要登录
     */
    needAuth: boolean;
    /**
     * 路由标题
     */
    title: string;
  }
}