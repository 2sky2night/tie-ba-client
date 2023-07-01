<template>
  <div class="article-list-load-container">
    <div class="article-list">

      <template v-if="list.length">
        <div class="tools" v-if="ctDesc || ctPageSize">

          <div class="controller-desc" v-if="ctDesc">
            <n-switch size="small" v-model:value="pagination.desc" @update:value="onHandleChangeOrder">
              <template #checked>
                <span style="font-size: 12px;">降序</span>
              </template>
              <template #unchecked>
                <span style="font-size: 12px;">升序</span>
              </template>
            </n-switch>
          </div>

          <div class="controller-page" v-if="ctPageSize">
            <n-select  size="small" style="width:100px" @update:value="onHandleChangeSize" v-model:value="pagination.pageSize" :options="pageSizesOption as any" />
          </div>

        </div>
        <article-item v-for="item in list" :key="item.aid" :article="item" v-model:is-liked="item.is_liked"
          v-model:is-star="item.is_star" v-model:like-count="item.like_count" v-model:star-count="item.star_count" />
      </template>

      <template v-else>
        <empty />
      </template>

    </div>
    <div class="load-more">
      <n-button strong secondary type="primary" @click="onHandleClick" :loading="isLoading"
        v-if="pagination.has_more">加载更多</n-button>
        <n-divider v-if="!pagination.has_more&&list.length">
          <span class="no-more">没有更多了</span>
        </n-divider>
    </div>
  </div>
</template>

<script lang='ts' setup>
// types 
import type { ArticleListLoadProps } from '@/types/components/list';
import type { ArticleItem } from '@/apis/public/types/article'
// hooks
import { ref, reactive, onBeforeMount, computed } from 'vue'

// 是否正在加载
const isLoading = ref(false)
const list = reactive<ArticleItem[]>([])
// props
const props = withDefaults(defineProps<ArticleListLoadProps>(), {
  pageSizes: () => [20, 30, 40],
  ctDesc: false,
  ctPageSize: false
})

if (!props.pageSizes.length) {
  throw new Error('自定义pageSizes必须提供数据且数组长度至少为1')
}
// pageSizes选项组
const pageSizesOption = computed(() => {
  return props.pageSizes.map(ele => {
    return {
      label: ele,
      value: ele,
    }
  })
})

// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: props.ctPageSize ? props.pageSizes[0] : 20,
  desc: true,
  total: 0,
  has_more: false
})

/**
 * 获取帖子列表的回调
 */
async function toGetListData() {
  try {
    isLoading.value = true
    const res = await props.getDataCb(pagination.page, pagination.pageSize, pagination.desc)
    pagination.total = res.total
    pagination.has_more = res.has_more
    pagination.desc = res.desc
    res.list.forEach(ele => list.push(ele))
    isLoading.value = false
  } catch (error) {
    console.log(error);
  }
}

/**
 * 点击加载更多的回调
 */
function onHandleClick() {
  pagination.page++
  toGetListData()
}

/**
 * 帖子排序顺序改变了
 */
function onHandleChangeOrder() {
  // 清空列表数据 重置页数 获取数据
  list.length = 0
  pagination.page = 1
  toGetListData()
}

/**
 * pageSize发生了改变
 */
function onHandleChangeSize(value:number) {
  pagination.pageSize=value
  list.length = 0
  pagination.page = 1
  toGetListData()
}

onBeforeMount(toGetListData)

defineOptions({
  name:'ArticleListLoad'
})
</script>

<style scoped lang='scss'>
.article-list-load-container {
  padding: 10px 0;
  .tools{
    display: flex;
    justify-content: space-between;
  }

  .load-more {
    display: flex;
    justify-content: center;
  }
}
</style>