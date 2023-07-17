import type { NavigationItemProps } from '@/types/components/layout/index'

/**
 * 登录之前的导航表
 */
export const noAuthNavigations: NavigationItemProps[] = [
  {
    path: '/',
    title:'首页'
  },
  {
    path: '/discover',
    title: '发现',
    children: [
      {
        path: '/discover/hot-article',
        title:'热帖'
      },
      {
        path: '/discover/bar',
        title:'吧'
      },
      {
        path: '/discover/hot-comment',
        title:'评论'
      }
    ]
  },
  {
    path: '/login',
    title:'登录'
  }
]

/**
 * 登录之后的导航表
 */
export const authNavigations: NavigationItemProps[] = [
  {
    path: '/',
    title:'首页'
  },
  {
    path: '/discover',
    title: '发现',
    children: [
      {
        path: '/discover/hot-article',
        title:'热帖'
      },
      {
        path: '/discover/bar',
        title:'吧'
      },
      {
        path: '/discover/hot-comment',
        title:'评论'
      },
      {
        path: '/discover/article',
        title:'帖子'
      }
    ]
  },
  {
    path: '/my',
    title:'我的'
  }
]