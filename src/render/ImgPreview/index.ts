import ImgPreview from '@/components/common/ImgPreview/index.vue'
import { h, render } from 'vue'
import './index.css'
export default function imgPreview(src: string) {
    const container = document.createElement('div')
    container.classList.add('img-previews-container-mask')

    const vnode = h(ImgPreview, { src, toClose: onHandleClose })
    render(vnode, container)

    container.addEventListener('click', onHandleClose)

    function onHandleClose() {
        if (vnode.component && vnode.component.exposed) {
            vnode.component.exposed.isShow.value = false
            setTimeout(() => {
                container.remove()
            }, 350)
        }
    }

    document.body.insertAdjacentElement('beforeend', container)
}
