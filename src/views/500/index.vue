<template>
  <div class="page-container">
    <n-result :size="isMobile ? 'medium' : 'huge'" status="500" title="500 服务器错误" description="要么是后端出错，要么是真的出错了">
      <template #footer>
        <n-button secondary @click="onHandleClick" :size="isMobile ? 'medium' : 'large'">看看别的 ?</n-button>
      </template>
    </n-result>
  </div>
</template>

<script lang='ts' setup>
import useIsMoblie from '@/hooks/useIsMobile';
import { useRouter } from 'vue-router';

const isMobile = useIsMoblie()
const router = useRouter()

const onHandleClick = () => {
  router.replace('/')
}

defineOptions({
  name: '500'
})
</script>

<style scoped lang='scss'>
.page-container{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>