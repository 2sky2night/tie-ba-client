<template>
  <div class="article-list-container">
    <div class="loading" v-if="pagination.isLoading">
      <ArticleListSkeleton :length="pagination.pageSize"></ArticleListSkeleton>
      <div class="pagination" v-if="pagination.total > pagination.pageSize">
        <n-pagination
        :page-slot="isMobile ? 6 : 8" 
        :size="isMobile ? 'medium' : 'large'"
        :page="pagination.page" 
        :item-count="pagination.total" 
        :page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes" 
        show-size-picker 
        />
      </div>
    </div>
    <div class="list" v-else>
      <div class="list-container" v-if="list.length">
        <article-item v-for="item in list" :key="item.aid" :article="item" v-model:isLiked="item.is_liked"
          v-model:isStar="item.is_star" v-model:starCount="item.star_count"
          v-model:likeCount="item.like_count"></article-item>
        <!--若帖子总数小于等于pageSize就不显示分页组件-->
        <div class="pagination" v-if="pagination.total > pagination.pageSize">
          <n-pagination
          :page-slot="isMobile ? 6 : 8" 
          :size="isMobile ? 'medium' : 'large'" 
          :page="pagination.page" 
          @update:page="onHandlePageUpdate"
          @update:page-size="onHandlePageSizeUpdate" 
          :item-count="pagination.total" 
          :page-size="pagination.pageSize"
          :page-sizes="pagination.pageSizes" 
          show-size-picker 
          />
        </div>
      </div>
      <div class="empty" v-else>
        <empty></empty>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
// types
import type { ArticleItem } from '@/apis/public/types/article';
import type { ArticleListResponse } from '@/apis/public/types/article';
import type { ListPageIns } from '@/types/components/list';
// hooks
import { reactive, onBeforeMount } from 'vue';
import useIsMoblie from '@/hooks/useIsMobile';
// utils
import PubSub from 'pubsub-js';

// 是否为移动端布局
const isMobile=useIsMoblie()
// 列表数据
const list = reactive<ArticleItem[]>([])
// props
const props = defineProps<{
  getData: (page: number, pageSize: number) => Promise<ArticleListResponse>
}>()
// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
  isLoading: false,
  pageSizes: [ 10, 20, 30, 40 ]
})
// 获取列表数据
async function getListData () {
  PubSub.publish('toScrollTop')
  // 清空列表数据
  list.length = 0
  pagination.isLoading = true
  const res = await props.getData(pagination.page, pagination.pageSize)
  res.list.forEach(ele => list.push(ele))
  pagination.total = res.total
  pagination.isLoading = false
}

// 操作分页组件 页码更新的回调
const onHandlePageUpdate = (value: number) => {
  pagination.page = value
  getListData()
}

// 操作分页组件 页长度更新的回调
const onHandlePageSizeUpdate = (value: number) => {
  pagination.pageSize = value
  toResetPage()
}

// 重置页码的回调
const toResetPage = async () => {
  pagination.page = 1
  // 重新获取数据
  await getListData()
}

onBeforeMount(getListData)
defineExpose<ListPageIns>({ toResetPage })
</script>

<style scoped lang='scss'>
.article-list-container {
  :deep(.article-item-container) {
    &:nth-last-child(2) {
      border: none;
    }
  }

  .pagination {
    display: flex;
    margin: 20px 0;
    justify-content: center;
  }
}
</style>