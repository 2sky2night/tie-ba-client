<template>
  <div class="article-list-infilite-container">
    <!--第一次加载-->
    <template v-if="isFirstLoading">
      <article-list-skeleton :length="10" />
    </template>

    <template v-else>
      <template v-if="list.length">
        <div class="article-list">
          <article-item v-for="item in list" :key="item.aid" :article="item" v-model:is-liked="item.is_liked"
            v-model:is-star="item.is_star" v-model:star-count="item.star_count" v-model:like-count="item.like_count" />
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
// hooks
import { ref, watch, reactive, onMounted, onBeforeUnmount, inject, type Ref } from 'vue'
// types 
import type { ArticleItem } from '@/apis/public/types/article';
import type { ArticleListLoadInfProps } from '@/types/components/list';
// tools
import pubsub from 'pubsub-js'

// 帖子列表
const list = reactive<ArticleItem[]>([])
// 是否滚动到了底部？
const isBottom = inject<Ref<boolean>>('isBottom')
// 分页数据
const pagination = reactive({
  page: 1,
  total: 0,
  hasMore: false,
  pageSize: 20
})
// 正在加载
const isLoading = ref(false)
// 第一次加载
const isFirstLoading = ref(false)
// 自定义属性
const props = defineProps<ArticleListLoadInfProps>()

// 获取列表项的函数
async function getData() {
  isLoading.value = true
  const res = await props.getList(pagination.page, pagination.pageSize)
  res.list.forEach(ele => list.push(ele))
  pagination.hasMore = res.has_more
  pagination.total = res.total
  isLoading.value = false
  if (!pagination.hasMore) {
    // 若没有更多了 不再加载数据了
    pubsub.publish('watchScroll', false)
  }
}
// 重置页码 重新获取数据
async function resetPage() {
  isFirstLoading.value = true
  pagination.page = 1
  list.length = 0
  await getData()
  isFirstLoading.value = false
  // 开启监听
  pubsub.publish('watchScroll', true)
}

// 获取数据并通知scroll组件 开启事件监听 监听容器的滚动条是否滚动到底部
onMounted(async () => {
  pubsub.publish('watchScroll', true)
  isFirstLoading.value = true
  await getData()
  isFirstLoading.value = false
  // 监听isBottom 若到底部了就加载下一页内容
  if (isBottom) {
    watch(isBottom, (v) => {
      if (isLoading.value || isFirstLoading.value) {
        // 若当前正在加载不允许获取最新数据 (非常重要)
        return
      }
      if (v) {
        // 若当前滚动到底部  页码+1 获取最新数据
        pagination.page++
        getData()
      }
    })
  }
})
onBeforeUnmount(() => {
  // 通知scroll组件 移除事件监听 节约性能
  pubsub.publish('watchScroll', false)
})

defineExpose({
  resetPage
})
</script>

<style scoped lang='scss'>
.article-list-infilite-container {
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

  .article-list {
    >div {
      &:last-child {
        border: none;
      }
    }
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
}
</style>