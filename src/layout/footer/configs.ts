import type { TabBarItemProps } from '@/types/components/layout';

// icons
import { Home, Search } from '@vicons/ionicons5'
import { UserOutlined } from '@vicons/antd'
import { IosCellular } from '@vicons/ionicons4'

/**
 * 用户未登录的tabbar
 */
export const noAuthTabBar: TabBarItemProps[] = [
  {
    path: '/',
    title: '首页',
    icon: Home
  },
  {
    path: '/discover',
    title: '发现',
    icon: IosCellular
  },
  {
    path: '/search',
    title: '搜索',
    icon: Search
  },
  {
    path: '/login',
    title: '登录',
    icon: UserOutlined
  }
]

/**
 * 用户登录后的tabbar
 */
export const authTabBar: TabBarItemProps[] = [
  {
    path: '/',
    title: '首页',
    icon: Home
  },
  {
    path: '/discover',
    title: '发现',
    icon: IosCellular
  },
  {
    path: '/search',
    title: '搜索',
    icon: Search
  },
  {
    path: '/my',
    title: '我的',
    icon: UserOutlined
  }
]