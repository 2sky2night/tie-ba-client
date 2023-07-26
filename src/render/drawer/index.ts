import { h, render } from 'vue'
import './index.css'
import Drawer from '@/components/drawer/index.vue'

/**
 * 创建抽屉
 * @param component 默认插槽中的组件
 * @param props 默认插槽中组件的自定义属性
 */
export default function drawerAPI<T = any> (title: string, component: any, props: T) {
  const container = document.createElement('div')
  container.classList.add('drawer-container')

  // 关闭的回调
  const onHandleClose = async () => {
    if (drawerIns.component?.exposed) {
      await drawerIns.component.exposed.onHandleClose()
    }
    container.remove()
  }

  // 渲染抽屉
  const drawerIns = h(Drawer, { title, onCloseDrawer: onHandleClose }, {
    //@ts-ignore 渲染插槽
    default: () => h(component, props)
  })

  // 点击遮罩层的回调
  container.addEventListener('click', onHandleClose)

  render(drawerIns, container)

  document.body.insertAdjacentElement('beforeend', container)
}