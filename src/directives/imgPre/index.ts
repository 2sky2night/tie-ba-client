import imgPreview from "@/render/ImgPreview";
import type { Directive } from "vue";

/**
 * 预览图片的自定义指令
 */
const imgPre: Directive<HTMLImageElement, string> = {
    mounted(el, binding) {
        el.addEventListener('click', (e: Event) => {
            imgPreview(binding.value)
            e.stopPropagation()
        })
    }
}

export default imgPre