<template>
  <div class="comment-list-inf-container">
    <template v-if="isFirstLoading">
      <comment-list-skeleton :length="10" />
    </template>
    <template v-else>
      <div class="list" v-if="list.length">
        <comment-item v-for=" item  in list" :key="item.cid" :comment="item" v-model:is-like="item.is_liked"
          v-model:like-count="item.like_count"></comment-item>
        <div class="spin" v-if="isLoading">
          <span class="sub-text mr-10">正在加载</span>
          <n-spin size="small" />
        </div>
        <div class="divier" v-if="!pagination.hasMore"><span class="sub-text">没有更多了</span></div>
      </div>
      <div class="empty" v-else>
        <empty></empty>
      </div>
    </template>
  </div>
</template>

<script lang='ts' setup>
// types
import type { CommentItem as CommentItemType } from '@/apis/public/types/article'
import { CommentListLoadInfProps, ListLoadInfIns } from '@/types/components/list';
// hooks
import { reactive, ref, onMounted, inject, type Ref, watch, onBeforeUnmount } from 'vue'
// tools
import PubSub from 'pubsub-js';

// 帖子列表
const list = reactive<CommentItemType[]>([])
// props 通过传入封装的函数获取对应的评论列表数据
const props = defineProps<CommentListLoadInfProps>()
// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
  hasMore: false
})
// 是否滚动到底部
const isBottom = inject<Ref<boolean>>('isBottom')
// 是否正在加载
const isLoading = ref(false)
// 是否第一次加载
const isFirstLoading = ref(false)

// 监听是否滚动到了底部从而改变页码 发送请求加载下一页数据
if (isBottom) {
  watch(isBottom, (v) => {
    if (isLoading.value || isFirstLoading.value) {
      // 若当前上一个请求还未完成 不允许更新页码
      return
    }
    if (v) {
      //  滚动到底部页码+1 获取数据
      pagination.page++
      getListData()
    }
  })
}

// 获取数据
async function getListData () {
  isLoading.value = true
  const res = await props.getData(pagination.page, pagination.pageSize)
  res.list.forEach(ele => list.push(ele))
  pagination.hasMore = res.has_more
  pagination.total = res.total
  isLoading.value = false
  // 若没有更多了 停止监听
  if (pagination.hasMore === false) {
    PubSub.publish('watchScroll', false)
  }
}
// 重置页码和列表项 获取数据
async function resetPage () {
  isFirstLoading.value = true
  // 元素挂载多个同一个事件且事件处理函数都是同一个指针 则事件触发时只会执行一次 
  // 所以随意开启监听 无论是否取消还是没有取消监听
  PubSub.publish('watchScroll', true)
  pagination.page = 1
  list.length = 0
  await getListData()
  isFirstLoading.value = false
}

onMounted(async () => {
  PubSub.publish('watchScroll', true)
  isFirstLoading.value = true
  await getListData()
  isFirstLoading.value = false
})

onBeforeUnmount(() => {
  PubSub.publish('watchScroll', false)
})

// 向外暴露重置页码的api 可以在其他场景下重置页码 获取数据
defineExpose<ListLoadInfIns>({ resetPage })

</script>

<style scoped lang="scss">
.comment-list-inf-container {
  .list {

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
}
</style>