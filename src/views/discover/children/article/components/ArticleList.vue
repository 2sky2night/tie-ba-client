<template>
  <article-list-inf ref="listIns" :get-list="getListData"></article-list-inf>
</template>

<script lang='ts' setup>
// apis
import { discoverArticleAPI } from '@/apis/discover/article';
import { getUserPostArticleListAPI } from '@/apis/public/user';
// hooks
import { watch, ref } from 'vue'
// types
import type { ListLoadInfIns } from '@/types/components/list';

// 列表组件实例
const listIns = ref<ListLoadInfIns | null>(null)
// props
const props = defineProps<{
  /**选择的用户*/
  selectUser: number | null
}>()

// 获取帖子列表 若当前选择了用户就获取对应用户的帖子，若未筛选就获取全部关注者的帖子
const getListData = async (page: number, pageSize: number) => {
  const res = props.selectUser === null ? await discoverArticleAPI(page, pageSize) : await getUserPostArticleListAPI(props.selectUser, page, pageSize, true)
  return res.data
}

// 监听选择的用户更新的回调
watch(() => props.selectUser, () => {
  // 重置页码 获取数据
  listIns.value?.resetPage()
})

</script>