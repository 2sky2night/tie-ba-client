<template>
  <div class="sub-page">
    <TypeSelector class="mb-10" v-model:value="hotType" @update:value="onHandleChangeType"></TypeSelector>
    <ArticleListInf ref="listIns" :get-list="onHandleGetData"></ArticleListInf>
  </div>
</template>

<script lang='ts' setup>
// apis
import { discoverHotArticleAPI } from '@/apis/discover/hot-article'
// hooks
import { ref } from 'vue'
// types
import type { HotType } from '@/apis/discover/hot-article/types';
import type { ListLoadInfIns } from '@/types/components/list';
// components
import TypeSelector from '../../components/TypeSelector.vue';

// 列表实例
const listIns=ref<ListLoadInfIns|null>(null)
// 类型
const hotType = ref<HotType>(4)

// 获取数据的api
const onHandleGetData = async (page: number, pageSize: number) => {
  const res = await discoverHotArticleAPI(hotType.value, page, pageSize)
  return res.data
}

// 类型更新的回调
const onHandleChangeType = () => {
  (listIns.value as ListLoadInfIns).resetPage()
}

defineOptions({
  name: 'DiscoverHot'
})
</script>

<style scoped lang="scss">
.sub-page{

}
</style>