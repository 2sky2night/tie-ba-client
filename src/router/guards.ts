import type { NavigationGuardWithThis, NavigationHookAfter } from 'vue-router'

/**
 * 全局路由前置守卫
 * @param to 
 * @param from 
 * @param next 
 */
export const beforeEachHook: NavigationGuardWithThis<undefined> = (to, from, next) => {
  next()
}

/**
 * 全局后置守卫
 * @param to 
 */
export const afterHook: NavigationHookAfter = (to) => {
  if (to.meta) {
    document.title = to.meta.title + ' | 贴吧'
  } else {
    document.title = '贴吧'
  }
}