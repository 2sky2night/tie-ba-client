<template>
  <div class="followed-user">
    <div class="order mb-10">
      <span>根据关注时间</span>
      <n-switch size="large" :loading="isLoading" v-model:value="isDesc" @update:value="onHandleDescUpdate" :round="false">
        <template #checked>
          降序
        </template>
        <template #unchecked>
          升序
        </template>
      </n-switch>
    </div>
    <div class="list">
      <UserListPagination ref="listIns" :get-data="getListData" />
    </div>
  </div>
</template>

<script lang='ts' setup>
// apis
import { getBarFollowUserAPI } from '@/apis/bar';
// hooks
import { watch, ref } from 'vue'
// types
import type { ListPageIns } from '@/types/components/list';
// utlis
import PubSub from 'pubsub-js';

// props
const props = defineProps<{ bid: number }>()
// 分页组件实例
const listIns = ref<ListPageIns>()
// 排序依据
const isDesc = ref(true)
// 正在加载
const isLoading = ref(false)

// 获取数据的回调
async function getListData (page: number, pageSize: number) {
  const res = await getBarFollowUserAPI(props.bid, page, pageSize, isDesc.value)
  return res.data
}
// 排序方式更新的回调
const onHandleDescUpdate = async () => {
  isLoading.value = true
  await onHandleReset()
  isLoading.value = false
}

// 通过组件实例重置页码 获取数据
const onHandleReset = async () => {
  if (listIns.value) {
    await listIns.value.toResetPage()
  }
}
// 若通过吧详情信息组件barInfo点击了关注吧 且当前组件为激活状态 需要重新加数据
PubSub.subscribe('toFollowBar', async () => {
  isLoading.value = true
  await onHandleReset()
  isLoading.value = false
})

watch(() => props.bid, () => {
  onHandleReset()
})

</script>

<style scoped lang='scss'>
.followed-user {
  .order {
    display: flex;
    justify-content:space-between
  }
}
</style>