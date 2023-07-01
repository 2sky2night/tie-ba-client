import { useIntersectionObserver } from '@vueuse/core'
import type { Directive } from 'vue'

const lazyImg: Directive<HTMLImageElement, string> = {
    mounted(el, binding) {
        
        const { stop } = useIntersectionObserver(
            el,
            ([{ isIntersecting }]) => {
                if (isIntersecting) {
                    const img = new Image()
                    img.src = binding.value
                    img.onload = () => {
                        el.src = binding.value
                    }
                    stop()
                }
            }
        )
    }
}

export default lazyImg