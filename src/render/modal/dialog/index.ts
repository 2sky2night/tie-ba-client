import Dialog from '@/components/modal/dialog/index.vue'
import { h, render } from 'vue'
import './index.css'

export default function asyncDialog(title = '标题', content = '主要内容') {
  const container = document.createElement('div')
  container.classList.add('async-dialog-container')

  return new Promise((resolve, reject) => {

    const vnode = h(Dialog, { title, content, toClose })
    // 点击遮罩层关闭弹窗
    container.onclick = () => toClose(false)
    render(vnode, container)
    document.body.insertAdjacentElement('beforeend',container)

    function toClose(flag:boolean) {
      if (vnode.component) {
        if (vnode.component.exposed && vnode.component.exposed.isShow) {
          vnode.component.exposed.isShow.value=false
        }
      }
      setTimeout(() => {
        container.remove()
        if (flag) {
          resolve('confirm')
        } else {
          reject('cancel')
        }
      },300)
    }
  })
}