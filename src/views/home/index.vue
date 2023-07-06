<template>
  <div class="page-container">
    <article-list-inf :get-list="getArticleList" />
  </div>
</template>

<script lang='ts' setup>
import { getArticleListAPI } from '@/apis/home';

async function getArticleList (page: number, pageSize: number) {
  const res = await getArticleListAPI(page, pageSize, true)
  return res.data
}

defineOptions({
  name:'Home'
})
</script>

<style scoped lang='scss'>
.page-container{

}
</style>