<template>
  <div class="bar-list-inf-container">

    <template v-if="isFirstLoading">
      <BarListSkeleton :length="pagination.pageSize"></BarListSkeleton>
    </template>

    <template v-else>

      <template v-if="list.length">
        <div class="list-container">
          <BarItem v-for="  item   in list" :bar="item" :key="item.bid"></BarItem>
        </div>
        <div class="spin" v-if="pagination.isLoading">
          <span class="sub-text mr-10">正在加载</span>
          <n-spin size="small" />
        </div>
        <div class="divier" v-if="!pagination.hasMore"><span class="sub-text">没有更多了</span></div>
      </template>

      <template v-else>
        <div class="empty">
          <Empty></Empty>
        </div>
      </template>

    </template>

  </div>
</template>

<script lang='ts' setup>
// types
import type { BarItem as ItemType, BarListResponse } from '@/apis/public/types/bar';
import type { ListLoadInfIns } from '@/types/components/list';
// hooks
import { reactive, ref, inject, watch, type Ref, onMounted, onBeforeUnmount } from 'vue'
// configs
import { publish } from 'pubsub-js';

// 第一次加载
const isFirstLoading = ref(false)
// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 20,
  hasMore: false,
  isLoading: false
})
// 列表数据
const list = reactive<ItemType[]>([])
// 是否滚动到底部了
const isBottom = inject<Ref<boolean>>('isBottom')
// props
const props = defineProps<{
  getList: (page: number, pageSize: number) => Promise<BarListResponse>
}>()

if (isBottom) {
  watch(isBottom, (v) => {
    if (pagination.isLoading || isFirstLoading.value) {
      return
    }
    if (v) {
      pagination.page++
      getListData()
    }
  })
}

// 重置页码 获取数据
const resetPage = async () => {
  isFirstLoading.value = true
  list.length = 0
  pagination.page = 1
  publish('watchScroll', true)
  await getListData()
  isFirstLoading.value = false
}

// 获取数据
const getListData = async () => {
  pagination.isLoading = true
  const res = await props.getList(pagination.page, pagination.pageSize)
  pagination.hasMore = res.has_more
  res.list.forEach(ele => list.push(ele))
  if (pagination.hasMore === false) {
    publish('watchScroll', false)
  }
  pagination.isLoading = false
}

// 初始化获取数据
onMounted(async () => {
  isFirstLoading.value = true
  publish('watchScroll', true)
  await getListData()
  isFirstLoading.value = false
})
// 卸载监听
onBeforeUnmount(() => {
  publish('watchScroll', false)
})

defineExpose<ListLoadInfIns>({
  resetPage
})
</script>

<style scoped lang='scss'>
.bar-list-inf-container {
  .list-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .empty {
    padding-top: 100px;
  }

  .spin {
    padding: 15px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .divier {
    text-align: center;
    padding: 10px;
    position: relative;
    overflow: hidden;

    &::after,
    &::before {
      position: absolute;
      content: '';
      display: inline-block;
      height: 1px;
      background-color: var(--border-color-1);
      width: 100%;
      top: 50%;
    }

    &::after {
      margin-left: 10px;
    }

    &::before {
      transform: translateX(-100%);
      margin-left: -20px;
    }
  }

}

@media screen and (max-width:650px) {
  .bar-list-inf-container {
    .list-container {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>