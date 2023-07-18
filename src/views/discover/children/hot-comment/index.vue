<template>
  <div class="sub-page">
    <type-selector class="mb-10" v-model:value="hotType" @update:value="onHandleTypeChange"></type-selector>
    <CommentListInf  :go-article="true" ref="listIns" :get-data="getListData"></CommentListInf>
  </div>
</template>

<script lang='ts' setup>
// apis
import { discoverHotCommentAPI } from '@/apis/discover/hot-comment';
// components
import TypeSelector from '../../components/TypeSelector.vue';
// hooks
import { ref } from 'vue'
// types
import type { HotType } from '@/apis/discover/hot-comment/types';
import type { ListLoadInfIns } from '@/types/components/list';

// 热门类型
const hotType = ref<HotType>(4)
// 列表实例
const listIns=ref<ListLoadInfIns|null>(null)
// 获取数据的api
const getListData = async(page: number, pageSize: number) => {
  const res = await discoverHotCommentAPI(hotType.value, page, pageSize)
  return res.data
}
// 类型更新的回调
const onHandleTypeChange = () => {
  // 重置页码 获取数据
  listIns.value?.resetPage()
}
defineOptions({
  name:'DiscoverHotComment'
})
</script>

<style scoped lang='scss'>
.sub-page{

}
</style>