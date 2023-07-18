<template>
  <div class="page-container">
    <n-result :size="isMobile ? 'medium' : 'huge'" status="404" title="404 资源不存在" description="生活总归带点荒谬">
      <template #footer>
        <n-button secondary @click="onHandleClick" :size="isMobile ? 'medium' : 'large'">看看别的 ?</n-button>
      </template>
    </n-result>
  </div>
</template>

<script lang='ts' setup>
import {useRouter} from 'vue-router'
import useIsMoblie from '@/hooks/useIsMobile';

const isMobile = useIsMoblie()
const router = useRouter()

const onHandleClick = () => {
  router.replace('/')
}

defineOptions({
  name: '404'
})
</script>

<style scoped lang='scss'>
.page-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>