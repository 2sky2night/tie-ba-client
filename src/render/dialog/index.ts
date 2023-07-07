import Dialog from '@/components/dialog/index.vue'
import { h, render } from 'vue'

export default function dialog (title: string) {
  const container = document.createElement('div')

  const vnode = h(Dialog, { title })
  
  render(vnode, container)
  
  document.body.insertAdjacentElement('beforeend',container)

}