<template>
  <div class="page-container">
    <template v-if="pagination.isFirstLoading">
      <article-list-skeleton :length="pagination.pageSize"></article-list-skeleton>
    </template>
    <template v-else>
      <template v-if="list.length">
        <div class="list" >
          <article-item v-for="item in list" :article="item" v-model:isLiked="item.is_liked" v-model:isStar="item.is_star"
            v-model:starCount="item.star_count" v-model:likeCount="item.like_count"></article-item>
        </div>
        <div class="spin" v-if="pagination.isLoading">
          <span class="sub-text mr-10">正在加载</span>
          <n-spin size="small" />
        </div>
        <div class="divier" v-if="!pagination.hasMore"><span class="sub-text">没有更多了</span></div>
      </template>
      <div class="empty" v-else>
        <empty></empty>
      </div>
    </template>
  </div>
</template>

<script lang='ts' setup>
//apis
import { getArticleListAPI } from '@/apis/home';
// hooks
import { reactive, inject, type Ref, onMounted, onBeforeUnmount, watch, onDeactivated, onActivated } from 'vue'
// types
import { ArticleItem as ItemType } from '@/apis/public/types/article';
// utils
import { publish } from 'pubsub-js';

// 帖子列表
const list = reactive<ItemType[]>([])
// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 20,
  isLoading: false,
  hasMore: false,
  isFirstLoading: false
})
// 是否离开了该页面
let isLeaveThisPage = false

// 是否滚动到了底部
const isBottom = inject<Ref<boolean>>('isBottom')

// 监听是否滚动到底部
if (isBottom) {
  watch(isBottom, (v) => {

    if (pagination.isLoading || isLeaveThisPage) {
      // 若当前已经离开了该帖子或正在加载 则禁止加载数据
      return
    }

    if (v) {
      // 若滚动到底部
      pagination.page++
      getArticleList()
    }

  })
}

// 获取帖子列表的函数
async function getArticleList () {
  pagination.isLoading = true
  const res = await getArticleListAPI(pagination.page, pagination.pageSize, true)
  res.data.list.forEach(ele => list.push(ele))
  pagination.hasMore = res.data.has_more
  pagination.isLoading = false
  if (pagination.hasMore === false) {
    publish('watchScroll', false)
  }
}

onMounted(async () => {
  pagination.isFirstLoading = true
  publish('watchScroll', true)
  await getArticleList()
  pagination.isFirstLoading = false
})

// 缓存该页面
onDeactivated(() => {
  isLeaveThisPage = true
})

// 激活该页面
onActivated(() => {
  publish('watchScroll', true)
  isLeaveThisPage = false
})


// 组件卸载时 取消主视图滚动条监听
onBeforeUnmount(() => {
  if (pagination.hasMore === false) {
    publish('watchScroll', false)
  }
})

defineOptions({
  name: 'Home'
})
</script>

<style scoped lang='scss'>
.page-container {
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