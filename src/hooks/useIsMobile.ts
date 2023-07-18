import { ref, onMounted, onBeforeUnmount } from 'vue'

export default function (maxWidth=650){
  const isMoblie = ref(false)

  function checkIsMoble () {
    if (window.innerWidth <= maxWidth) {
      isMoblie.value=true
    } else {
      isMoblie.value=false
    }
  }

  onMounted(() => {
    checkIsMoble()
    window.addEventListener('resize',checkIsMoble)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize',checkIsMoble)
  })

  return isMoblie

}