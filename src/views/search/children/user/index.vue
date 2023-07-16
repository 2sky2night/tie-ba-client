<template>
  <div class="search-result-container" v-if="searchKeywords">
    <template v-if="isLoading">
      <UserListSkeleton :length="pagination.pageSize"></UserListSkeleton>
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
          <UserItem v-for="item in list" :key="item.uid" :user="item" v-model:fans-count="item.fans_count"></UserItem>
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
// type
import type { UserItem, UserListResponse } from '@/apis/public/types/user'
// hooks
import { reactive, ref } from 'vue'
import useSearch from '@/hooks/useSearch'

const list = reactive<UserItem[]>([])
const isLoading = ref(false)
const { pagination, searchKeywords, onHandleUpdatePage, onHandleUpdatePageSize } = useSearch(getData)

async function getData() {
  isLoading.value = true
  list.length = 0
  const res = await toSearchAPI<UserListResponse>(searchKeywords.value, 5, pagination.page, pagination.pageSize, true)
  res.data.list.forEach(ele => list.push(ele))
  isLoading.value = false
}

defineOptions({
  name: 'SearchUser'
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