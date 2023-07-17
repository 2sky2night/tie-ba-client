<template>
  <div class="user-list-inf-container">

    <template v-if="isFirstLoading">
      <user-list-skeleton :length="10"></user-list-skeleton>
    </template>

    <template v-else>

      <template v-if="list.length">
        <div class="user-list">
          <user-item :user="item" v-model:fans-count="item.fans_count" :key="item.uid" v-for=" item  in list"></user-item>
        </div>
        <div class="spin" v-if="isLoading">
          <span class="sub-text mr-10">正在加载</span>
          <n-spin size="small" />
        </div>
        <div class="divier" v-if="!pagination.hasMore"><span class="sub-text">没有更多了</span></div>
      </template>

      <template v-else>
        <div class="empty">
          <empty></empty>
        </div>
      </template>

    </template>
  </div>
</template>

<script lang='ts' setup>
// types
import type { UserItem as Item, UserListResponse } from '@/apis/public/types/user';
import type { ListLoadInfIns } from '@/types/components/list';
// hooks
import { reactive, onMounted, inject, onBeforeUnmount, type Ref, watch, ref } from 'vue'
// utils
import PubSub from 'pubsub-js';

// 用户数据
const list = reactive<Item[]>([])
// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
  hasMore: false
})
// props
const props = defineProps<{
  getData: (page: number, pageSize: number) => Promise<UserListResponse>
}>()
// 是否滚动到底部
const isBottom = inject<Ref<boolean>>('isBottom')
// 是否正在加载
const isLoading = ref(false)
// 是否初次加载
const isFirstLoading = ref(false)

// 重置页码和列表 获取数据
const resetPage = async () => {
  isFirstLoading.value = true
  PubSub.publish('watchScroll', true)
  list.length = 0
  pagination.page = 1
  await onHandleGetList()
  isFirstLoading.value = false
}
// 获取数据
const onHandleGetList = async () => {
  isLoading.value = true
  const res = await props.getData(pagination.page, pagination.pageSize)
  res.list.forEach(ele => list.push(ele))
  pagination.hasMore = res.has_more
  pagination.total = res.total
  isLoading.value = false
  if (pagination.hasMore === false) {
    PubSub.publish('watchScroll', false)
  }
}

onMounted(async () => {
  isFirstLoading.value = true
  PubSub.publish('watchScroll', true)
  await onHandleGetList()
  if (isBottom) {
    watch(isBottom, (v) => {
      // 滚动到底部的回调
      if (isLoading.value || isFirstLoading.value) {
        // 如上一个请求未结束 不能增加页码
        return
      }
      if (v) {
        // 滚动到底部就加载更多数据
        pagination.page++
        onHandleGetList()
      }
    })
  }
  isFirstLoading.value = false
})
onBeforeUnmount(() => {
  PubSub.publish('watchScroll', false)
})

// 向外暴露重置页码的api 可以在其他场景下重置页码 获取数据
defineExpose<ListLoadInfIns>({ resetPage })
</script>

<style scoped lang='scss'>
.user-list-inf-container {
  .user-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
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
  .user-list-inf-container {
    .user-list {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>