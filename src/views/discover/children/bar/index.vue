<template>
  <div class="sub-page">
    <TypeSelector class="mb-10" v-model:value="hotType" @update:value="onHandleUpdata"   ></TypeSelector>
    <BarListInf ref="listIns" :get-list="onHandleGetData"></BarListInf>
  </div>
</template>

<script lang='ts' setup>
// apis
import { discoverBarAPI } from '@/apis/discover/bar';
// types
import type { HotType } from '@/apis/discover/bar/types';
import type { ListLoadInfIns } from '@/types/components/list';
// hooks
import { ref } from 'vue'
// components
import TypeSelector from '../../components/TypeSelector.vue';

// 类型
const hotType = ref<HotType>(4)
const listIns = ref<ListLoadInfIns | null>(null)

// 获取数据
const onHandleGetData = async (page: number, pageSize: number) => {
  const res = await discoverBarAPI(hotType.value, page, pageSize)
  return res.data
}

// 类型更新的回调
const onHandleUpdata = () => {
  listIns.value?.resetPage()
}

defineOptions({
  name: 'DiscoverBar'
})
</script>

<style scoped lang='scss'></style>