<template>
  <div class="article-list-load-container">
    <div class="article-list">

    </div>
    <div class="load-more">
      <n-button>加载更多</n-button>
    </div>
  </div>
</template>

<script lang='ts' setup>
// types 
import type { ArticleListLoadProps } from '@/types/components/list';
// hooks
import { ref } from 'vue'
// props
const props = defineProps<ArticleListLoadProps>()

</script>

<style scoped lang='scss'>
.article-list-load-container {
  .article-list {}

  .load-more {}
}
</style>