<template>
  <div class="articles-container">
    <div class="order mb-10">
      <n-select :loading="isLoading" :value="order.type" :default-value="order.type" @update:value="onHandleTypeUpdate"
        :options="selectOption" />
      <n-switch size="large" :loading="isLoading" :round="false" :vlaue="order.desc" @update:value="onHandleDescUpdate">
        <template #checked>
          降序
        </template>
        <template #unchecked>
          升序
        </template>
      </n-switch>
    </div>
    <div class="list">
      <ArticleListPagination ref="listIns" :get-data="getBarAritcleList" />
    </div>
  </div>
</template>

<script lang='ts' setup>
// types
import type { SelectOption } from 'naive-ui';
import type { ListPageIns } from '@/types/components/list';
// apis
import { getBarArticleAPI } from '@/apis/bar';
// hooks
import { ref, watch, reactive } from 'vue'

// props
const props = defineProps<{ bid: number }>()
// 列表实例
const listIns = ref<ListPageIns>()
// 排序
const order = reactive<{ desc: boolean, type: 1 | 2 }>({
  desc: true,
  type: 1
})
// 排序依据下拉框选项
const selectOption: SelectOption[] = [
  {
    label: '热度',
    value: 1
  },
  {
    label: '时间',
    value: 2
  }
]
// 正在加载
const isLoading = ref(false)

// 获取吧列表数据封装的api
async function getBarAritcleList (page: number, pageSize: number) {
  const res = await getBarArticleAPI(props.bid, page, pageSize, order.desc, order.type)
  return res.data
}

// 排序依据更新的回调
const onHandleTypeUpdate = async (value: 1 | 2) => {
  isLoading.value = true
  order.type = value;
  (listIns.value as ListPageIns).toResetPage()
  isLoading.value = false
}

// 排序方式更新的回调
const onHandleDescUpdate = async (value: boolean) => {
  isLoading.value = true
  order.desc = value;
  (listIns.value as ListPageIns).toResetPage()
  isLoading.value = false
}


// 路由参数更新 重置页码 获取数据
watch(() => props.bid, () => {
  (listIns.value as ListPageIns).toResetPage()
})

</script>

<style scoped lang='scss'>
.articles-container {
  .order {
    display: flex;
    justify-content: space-between;
    align-items: center;
    :deep(.n-select) {
      width: 80px;
    }
  }
}
</style>