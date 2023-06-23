import { type DropdownOption, NIcon } from 'naive-ui'
import { type Component, h } from 'vue'
import { LogInOutline, Star,LogOutOutline } from '@vicons/ionicons5'
import { HistoryOutlined } from '@vicons/antd'
import { UserEdit,UserRegular,UserPlus } from '@vicons/fa'

/**
 * 渲染icon虚拟DOM
 * @param icon 对应图标组件
 * @returns 
 */
export const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

/**
 * 用户未登录的菜单
 */
export const noAuthMenu: DropdownOption[] = [
  {
    label: '登录',
    key: '/login',
    icon: renderIcon(LogInOutline)
  },
  {
    label: '注册',
    key: '/register',
    icon:renderIcon(UserPlus)
  },
  {
    label: '浏览的历史',
    key: '/history',
    icon:renderIcon(HistoryOutlined)
  },
]

/**
 * 用户登录后的菜单
 */
export const authMenu: DropdownOption[] = [
  {
    label: '我的',
    key: '/my',
    icon:renderIcon(UserRegular)
  },
  {
    label: '编辑用户资料',
    key: '/edit',
    icon: renderIcon(UserEdit)
  },
  {
    label: '收藏的帖子',
    key: '/star',
    icon: renderIcon(Star)
  },
  {
    label: '浏览的历史',
    key: '/history',
    icon:renderIcon(HistoryOutlined)
  },
  {
    label: '登出',
    key: 'logout',
    icon:renderIcon(LogOutOutline)
  },
]
