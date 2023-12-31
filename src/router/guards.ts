import type { NavigationGuardWithThis, NavigationHookAfter } from 'vue-router'
import useUserStore from '@/store/user'
import tips from '@/config/tips'

/**
 * 全局路由前置守卫
 * @param to 
 * @param from 
 * @param next 
 */
export const beforeEachHook: NavigationGuardWithThis<undefined> = (to, _from, next) => {
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
        window.$message.warning(tips.pleaseLogin)
        // 若未登录 进入了需要登录的页面 则跳转到403页面
        next({
          path: '403',
          replace:true
        })
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
export const loginRoutesHook: NavigationGuardWithThis<undefined> = (_to, from, next) => {
  const userStore = useUserStore()
  if (userStore.isLogin) {
    // 跳转回上一个页面
    window.$message.warning(tips.pleaseDoNotRepeatLogin)
    if (from.path === '/') {
      next('/')
    } else {
      next(false)
    }
  } else {
    next()
  }
}

/**
 * 用户页面的路由独享守卫 禁止当前登录的用户进入用户页面
 * @param to 
 * @param _from 
 * @param next 
 */
export const userRoutesHooks: NavigationGuardWithThis<undefined> = (to, _from, next) => {
  const userStore = useUserStore()
  if (to.params.uid) {
    const uid = + to.params.uid
    if (isNaN(uid)) {
      window.$message.error(tips.errorParams)
      next(false)
    } else if (uid === userStore.userData.uid) {
      // 当前登陆的用户不能访问用户页
      next('/my')
    } else {
      next()
    }
  } else {
    window.$message.error(tips.emptyParams)
    next('/')
  }
}