<template>
  <div class="page-container">
    <n-result :size="isMobile?'medium':'huge'" status="403" title="403 禁止访问" description="总有些门是对你关闭的">
      <template #footer>
        <n-button :size="isMobile?'medium':'large'" @click="onHandleClick">去登录 ?</n-button>
      </template>
    </n-result>
  </div>
</template>

<script lang='ts' setup>
import {useRouter} from 'vue-router'
import useIsMoblie from '@/hooks/useIsMobile';

const isMobile=useIsMoblie()
const router = useRouter()

const onHandleClick = () => {
  router.replace('/login')
}

defineOptions({
  name: '403'
})
</script>

<style scoped lang='scss'>
.page-container{
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>