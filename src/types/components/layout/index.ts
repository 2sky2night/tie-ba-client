import type { Component } from 'vue';
/**
 * NavigationItem组件的自定义属性（该组件用来渲染一级和二级路由菜单）
 */
export interface NavigationItemProps {
  /**
   * 当前路由的路径
   */
  path: string;
  /**
   * 当前路由的名称
   */
  title: string;
  /**
   * 子路由
   */
  children?: {
    path: string;
    title: string;
  }[]
}

/**
 * Tabbar项组件的自定义属性
 */
export interface TabBarItemProps {
  /**
   * 导航路径
   */
  path: string;
  /**
   * 图标组件
   */
  icon: Component;
  /**
   * 标题
   */
  title: string;
}