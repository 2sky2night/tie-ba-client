import type { NavigationGuardWithThis, NavigationHookAfter } from 'vue-router'
import useUserStore from '@/store/user'

/**
 * 全局路由前置守卫
 * @param to 
 * @param from 
 * @param next 
 */
export const beforeEachHook: NavigationGuardWithThis<undefined> = (to, from, next) => {
  const userStore = useUserStore()
  if (to.meta) {
    // 是否有meta配置项
    if (to.meta.needAuth) {
      // 需要鉴权的页面
      if (userStore.isLogin) {
        // 用户登录了
        next()
      } else {
        // 未登录
        window.$message.warning('请先登录!')
        next('/login')
      }
    } else {
      //不需要鉴权的页面
      next()
    }
  } else {
    next()
  }
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

/**
 * 登录页面的路由独享守卫
 * @param to 
 * @param from 
 * @param next 
 */
export const loginRoutesHook: NavigationGuardWithThis<undefined> = (to, from, next) => {
  const userStore = useUserStore()
  if (userStore.isLogin) {
    // 跳转回上一个页面
    window.$message.warning('请勿重复登录!')
    if (from.path === '/') {
      next('/')
    } else {
      next(false)
    }
  } else {
    next()
  }
}