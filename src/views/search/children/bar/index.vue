<template>
  <div class="search-result-container" v-if="searchKeywords">
    <template v-if="isLoading">
      <BarListSkeleton :length="pagination.pageSize"></BarListSkeleton>
      <div class="pagination">
        <n-pagination
        :page-slot="isMobile ? 6 : 8" 
        :size="isMobile ? 'medium' : 'large'"
        :page-size="pagination.pageSize" 
        :page="pagination.page" 
        :item-count="pagination.total"
        show-size-picker 
        :page-sizes="[20, 30, 40, 50]">
          <template #prefix="{ itemCount }">
            共 {{ itemCount }} 项
          </template>
        </n-pagination>
      </div>
    </template>
    <template v-else>
      <template v-if="list.length">
        <div class="list-container">
          <bar-item v-for="item in list" :key="item.bid" :bar="item"></bar-item>
        </div>
        <div class="pagination">
          <n-pagination
          :page-slot="isMobile ? 6 : 8" 
          :size="isMobile ? 'medium' : 'large'"
          @update:page="onHandleUpdatePage" 
          @update:page-size="onHandleUpdatePageSize"
          :page-size="pagination.pageSize" 
          :page="pagination.page" 
          :item-count="pagination.total" 
          show-size-picker
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
import type { BarItem, BarListResponse } from '@/apis/public/types/bar';
// hooks
import { reactive, ref } from 'vue'
import useSearch from '@/hooks/useSearch'
import useIsMoblie from '@/hooks/useIsMobile'

const isMobile=useIsMoblie()
// 吧列表数据
const list = reactive<BarItem[]>([])
// 正在加载
const isLoading = ref(false)
// 分页数据
const { pagination, searchKeywords, onHandleUpdatePage, onHandleUpdatePageSize } = useSearch(getData)

async function getData() {
  isLoading.value = true
  list.length = 0
  const res = await toSearchAPI<BarListResponse>(searchKeywords.value, 3, pagination.page, pagination.pageSize, true)
  res.data.list.forEach(ele => list.push(ele))
  pagination.total = res.data.total
  isLoading.value = false
}

defineOptions({
  name: 'SearchBar'
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
    display: flex;
    margin: 10px 0;
    justify-content: center;
  }

  .list-container {
    display: flex;
    flex-direction: column;
  }

  .empty {
    padding-top: 50px;
  }
}

@media screen and (min-width:651px) {
  .search-result-container {
    .list-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>