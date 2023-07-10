<template>
  <div class="page-container">
    <template v-if="aid !== null">
      <ArticleInfo :aid="aid" />
      <Panel :aid="aid" />
    </template>
  </div>
</template>

<script lang='ts' setup>
// hooks
import { ref } from 'vue';
import useCheckRoutes from '@/hooks/useCheckRoutes';
import { onBeforeRouteUpdate } from 'vue-router';
// components
import ArticleInfo from './components/ArticleInfo/index.vue';
import Panel from './components/Panel/index.vue'

const checkRoutes = useCheckRoutes('aid')
const aid = ref<number | null>(checkRoutes())

// 路由更新获取最新的aid参数值
onBeforeRouteUpdate(to => {
  aid.value = checkRoutes(to)
})

defineOptions({
  name: 'Article'
})
</script>

<style scoped lang='scss'>
.page-container {
  padding: 10px 12px;
}
</style>