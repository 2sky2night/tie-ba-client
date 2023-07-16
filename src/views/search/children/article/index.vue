<template>
  <!--搜索结果-->
  <div class="search-result-container" v-if="searchKeywords">

    <template v-if="isLoading">
      <ArticleListSkeleton :length="pagination.pageSize"></ArticleListSkeleton>
      <div class="pagination">
        <n-pagination :page-size="pagination.pageSize" :page="pagination.page" :item-count="pagination.total"
          show-size-picker :page-sizes="[20, 30, 40, 50]">
          <template #prefix="{ itemCount }">
            共 {{ itemCount }} 项
          </template>
        </n-pagination>
      </div>
    </template>

    <template v-else>
      <template v-if="list.length">
        <div class="list-container">
          <article-item v-for="item in list" :key="item.aid" :article="item" v-model:is-liked="item.is_liked"
            v-model:is-star="item.is_star" v-model:like-count="item.like_count"
            v-model:star-count="item.star_count"></article-item>
        </div>
        <div class="pagination">
          <n-pagination @update:page="onHandleUpdatePage" @update:page-size="onHandleUpdatePageSize"
            :page-size="pagination.pageSize" :page="pagination.page" :item-count="pagination.total" show-size-picker
            :page-sizes="[20, 30, 40, 50]">
            <template #prefix="{ itemCount }">
              共 {{ itemCount }} 项
            </template>
          </n-pagination>
        </div>
      </template>
      <template v-else>
        <div class="empty">
          <empty></empty>
        </div>
      </template>
    </template>
  </div>
  <!--用户直接进入该页面-->
  <div class="search-none-container" v-else>
    <div class="face">🧐</div>
    <div class="tips">请先输入内容然后点击搜索按钮进行搜索哟</div>
  </div>
</template>

<script lang='ts' setup>
// apis
import { toSearchAPI } from '@/apis/search'
// types
import type { ArticleListResponse } from '@/apis/public/types/article'
import type { ArticleItem } from '@/apis/public/types/article';
// hooks
import useSearch from '@/hooks/useSearch';
import { reactive, ref } from 'vue';

// 分页数据 以及搜索关键词
const { pagination, searchKeywords, onHandleUpdatePage, onHandleUpdatePageSize } = useSearch(getData)
// 列表
const list = reactive<ArticleItem[]>([])
// 正在加载
const isLoading = ref(false)

// 获取列表数据
async function getData() {
  isLoading.value = true
  list.length = 0
  const res = await toSearchAPI<ArticleListResponse>(searchKeywords.value, 6, pagination.page, pagination.pageSize, true)
  res.data.list.forEach(ele => list.push(ele))
  pagination.total = res.data.total
  isLoading.value = false
}

defineOptions({
  name: 'SearchArticle'
})
</script>

<style scoped lang='scss'>
.search-none-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;

  .face {
    font-size: 80px;
  }

  .tips {
    font-size: 15px;
    color: var(--text-color-2)
  }
}

.search-result-container {
  .pagination {
    margin: 10px 0;
    display: flex;
    justify-content: center;
  }

  .empty {
    padding-top: 50px;
  }
}
</style>