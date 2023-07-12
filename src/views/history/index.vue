<template>
  <div class="page-container">
    <div class="header">
      <span class="page-title mr-10">历史记录</span>
      <span class="sub-text">共{{ pagination.total }}项</span>
    </div>
    <template v-if="isFirstLoading">
      <ArticleListSkeleton :length="pagination.pageSize" ></ArticleListSkeleton>
    </template>
    <template v-else>
      <template v-if="list.length">
        <div class="list" v-if="list.length">
          <template v-for="item in list">
            <n-carousel draggable :slides-per-view="2"
    :space-between="20">
              <n-carousel-item style="width: 80%;">
                <article-item v-model:isLiked="item.is_liked"  :key="item.aid" :article="item"
                  v-model:is-star="item.is_star" v-model:star-count="item.star_count"
                  v-model:like-count="item.like_count"></article-item>
              </n-carousel-item>
              <n-carousel-item style="width: 20%;">
                <div class="actions"><n-button>删除历史记录</n-button></div>
              </n-carousel-item>
            </n-carousel>
          </template>
        </div>
        <div class="spin" v-if="isLoading">
          <span class="sub-text mr-10">正在加载</span>
          <n-spin size="small" />
        </div>
        <div class="divier" v-if="list.length>=pagination.total"><span class="sub-text">没有更多了</span></div>
      </template>
      <div class="empty" v-else>
        <Empty></Empty>
      </div>
    </template>
  </div>
</template>

<script lang='ts' setup>
// apis
import { getHistoryArticleAPI } from '@/apis/history';
// hooks
import { reactive, ref, onBeforeMount, computed, inject, watch, onMounted, onBeforeUnmount, type Ref } from 'vue'
import useUserStore from '@/store/user';
// types
import type { ArticleItem } from '@/apis/public/types/article';
// utils
import PubSub from 'pubsub-js';

// 首次加载
const isFirstLoading=ref(false)
// 帖子列表
const list = reactive<ArticleItem[]>([])
// 用户仓库
const userStore = useUserStore()
// 分页数据
const pagination = ref({
  page: 1,
  // total无需响应式 只需要初始化获取总共有多少条记录即可 每次重新加载历史记录都是最新的total
  total: userStore.historyAids.length,
  isLoading: false,
  pageSize: 10
})
// 当前需要浏览的帖子id列表
const aidList = computed(() => {
  const offset = (pagination.value.page - 1) * pagination.value.pageSize
  const limit = offset + pagination.value.pageSize
  return userStore.historyAids.slice(offset, limit)
})
// 是否滚动到底部了
const isBottom = inject<Ref<boolean>>('isBottom')
// 是否正在加载
const isLoading = ref(false)

// 获取数据的函数
async function getListData () {
  isLoading.value = true
  const res = await getHistoryArticleAPI(aidList.value.join())
  res.data.list.forEach(ele => list.push(ele))
  // 若请求的帖子总数量大于等于总数量 则取消监听视图滚动
  if (list.length >= pagination.value.total) {
    PubSub.publish('watchScroll', false)
  }
  isLoading.value = false
}

onBeforeMount(async() => {
  isFirstLoading.value = true
  await getListData()
  isFirstLoading.value = false
})

onMounted(() => {
  // 开启监听
  PubSub.publish('watchScroll', true)
  // 若当前滚动到底部了 加载更多数据
  if (isBottom) {
    watch(isBottom, (v) => {
      if (isLoading.value) {
        // 若当前加载的帖子还未响应回来禁止加载数据
        return
      }
      if (v) {
        pagination.value.page++
        getListData()
      }
    })
  }
  // 卸载时取消监听
  onBeforeUnmount(() => {
    PubSub.publish('watchScroll', false)
  })
})

defineOptions({
  name: 'History'
})
</script>

<style scoped lang='scss'>
.page-container {
  .empty {
    padding-top: 100px;
  }
  .actions{
    background-color: red;
  }

  .spin {
    margin: 20px 0;
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
</style>