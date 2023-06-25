import { type VNode, h, render } from 'vue'
import Modal from '@/components/modal/message/index.vue'
import './index.css'

export default function model(title: string, renderVnode: () => VNode) {
    // 模态框容器
    const container = document.createElement('div')
    container.classList.add('model-container')


    const vnode = h(Modal, { title, closeHandler: onHandleClose }, { default: renderVnode })
    render(vnode, container)

    // 关闭模态框的回调
    function onHandleClose() {
        // 销毁模态框组件
        if (vnode.component && vnode.component.exposed) {
            vnode.component.exposed.isShow.value = false
        }
        // 销毁容器
        setTimeout(() => {
            container.remove()
        }, 300);
    }

    document.body.insertAdjacentElement("beforeend", container)
}
