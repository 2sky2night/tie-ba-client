<template>
  <div class="page-container">
    <template v-if="aid!==null">
      <ArticleInfo :aid="aid" />
    </template>
  </div>
</template>

<script lang='ts' setup>
// hooks
import { ref,onBeforeMount } from 'vue';
import useCheckRoutes from '@/hooks/useCheckRoutes';
import { onBeforeRouteUpdate } from 'vue-router';
// components
import ArticleInfo from './components/ArticleInfo.vue';

const checkRoutes= useCheckRoutes('aid')
const aid = ref<number|null>(checkRoutes())

// 路由更新获取最新的aid参数值
onBeforeRouteUpdate(to => {
  const temp = checkRoutes(to)
  if (temp!==null) {
    aid.value=temp
  }
})

defineOptions({
  name:'Article'
})
</script>

<style scoped lang='scss'>
.page-container{
  padding: 10px 12px;
}
</style>