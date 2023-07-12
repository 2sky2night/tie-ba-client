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
import useUserStore from '@/store/user';
// components
import ArticleInfo from './components/ArticleInfo/index.vue';
import Panel from './components/Panel/index.vue'

const checkRoutes = useCheckRoutes('aid')
const aid = ref<number | null>(checkRoutes())
const userStore = useUserStore()

// 保存当前帖子的历史记录
const onHandleLookArticle = () => {
  if (aid.value !== null) {
    userStore.addHistory(aid.value)
  }
}

// 记录当前帖子的历史记录
onHandleLookArticle()

// 路由更新获取最新的aid参数值
onBeforeRouteUpdate(to => {
  aid.value = checkRoutes(to)
  onHandleLookArticle()
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