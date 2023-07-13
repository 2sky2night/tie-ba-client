// types 
import { type DropdownOption, NIcon } from 'naive-ui'
import { type Component, h } from 'vue'
// components
import { LogInOutline, LogOutOutline,DocumentTextSharp } from '@vicons/ionicons5'
import { HistoryOutlined } from '@vicons/antd'
import { UserEdit, UserRegular, UserPlus, UserCircleRegular } from '@vicons/fa'
import { NAvatar } from 'naive-ui'
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
    icon: renderIcon(UserPlus)
  },
  {
    label: '浏览的历史',
    key: '/history',
    icon: renderIcon(HistoryOutlined)
  },
]

/**
 * 用户登录后的菜单
 */
export const authMenu: DropdownOption[] = [
  {
    label: '我的',
    key: '/my',
    icon: renderIcon(UserRegular)
  },
  {
    label: '编辑用户资料',
    key: '/edit',
    icon: renderIcon(UserEdit)
  },
  {
    label: '发帖',
    key: '/post-article',
    icon: renderIcon(DocumentTextSharp)
  },
  {
    label: '浏览的历史',
    key: '/history',
    icon: renderIcon(HistoryOutlined)
  },
  {
    label: '登出',
    key: 'logout',
    icon: renderIcon(LogOutOutline)
  },
]

/**
 * 渲染用户头部菜单
 * @param username 
 * @param avatar 
 * @returns 
 */
export const renderUserTitle = (username: string, avatar: string) => {
  return h('div', { style: 'display:flex;align-items:center;padding:0 5px;margin:5px 0;padding-bottom:8px;border-bottom:1px solid var(--border-color-1);' }, [
    h(NAvatar, { size:'small',src: avatar, round: true, class: 'mr-10' }),
    h('div', username)
  ])
}

/**
 * 渲染游客头部菜单
 * @returns 
 */
export const renderGuestTitle = () => {
  return h(
    'div',
    {
      style: 'display:flex;align-items:center;box-sizing:border-box;padding:0 10px;padding-bottom:5px;margin:5px 0;border-bottom:1px solid var(--border-color-1);'
    },
    [
      h(NIcon, { size: 18 }, { default: () => h(UserCircleRegular) }),
      h('div',{style:'margin-left:8px'}, '未登录')
    ]
  )
}