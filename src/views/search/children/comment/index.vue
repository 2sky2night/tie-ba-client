<template>
  <div class="search-result-container" v-if="searchKeywords">
    <template v-if="isLoading">
      <CommentListSkeleton :length="pagination.pageSize"></CommentListSkeleton>
      <n-pagination :page-size="pagination.pageSize" :page="pagination.page" :item-count="pagination.total"
        show-size-picker :page-sizes="[20, 30, 40, 50]">
        <template #prefix="{ itemCount }">
          共 {{ itemCount }} 项
        </template>
      </n-pagination>
    </template>
    <template v-else>
      <template v-if="list.length">
        <div class="list-container">
          <comment-item @click="() => onHanldeClick(item.aid)" v-for="item in list" :key="item.cid" :comment="item"
            v-model:is-like="item.is_liked" v-model:like-count="item.like_count"></comment-item>
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
  <div class="search-none-container" v-else>
    <div class="face">🧐</div>
    <div class="tips">请先输入内容然后点击搜索按钮进行搜索哟</div>
  </div>
</template>

<script lang='ts' setup>
// apis
import { toSearchAPI } from '@/apis/search'
// typs
import type { CommentItem, CommentListResponse } from '@/apis/public/types/article'
// hooks
import { reactive, ref } from 'vue'
import useSearch from '@/hooks/useSearch';
import useNavigation from '@/hooks/useNavigation';
// render
import asyncDialog from '@/render/modal/dialog'

const { goArticle } = useNavigation()
const isLoading = ref(false)
const list = reactive<CommentItem[]>([])
const { pagination, onHandleUpdatePage, onHandleUpdatePageSize, searchKeywords } = useSearch(getData)

async function getData() {
  isLoading.value = true
  list.length = 0
  const res = await toSearchAPI<CommentListResponse>(searchKeywords.value, 4, pagination.page, pagination.pageSize, true)
  res.data.list.forEach(ele => list.push(ele))
  pagination.total = res.data.total
  isLoading.value = false
}

// 点击评论的回调
const onHanldeClick = async (aid: number) => {
  try {
    await asyncDialog('提示','是否浏览该帖子?')
    goArticle(aid)
  } catch (error) {
    
  }
}

defineOptions({
  name: 'SearchComment'
})
</script>

<style scoped lang='scss'>
.search-result-container {
  .pagination {
    display: flex;
    margin: 10px 0;
    justify-content: center;
  }

  .empty {
    padding-top: 50px;
  }
}

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
</style>