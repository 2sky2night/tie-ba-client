<template>
  <div class="page-container">
    <div class="page-title">
      <span>所有的吧</span>
      <span class="ml-5 sub-text">共{{ pagination.total }}个吧</span>
    </div>
    <div class="loading" v-if="pagination.isLoading">
      <BarListSkeleton :length="pagination.pageSize"></BarListSkeleton>
      <div class="pagination">
        <n-pagination 
        :page-slot="isMobile ? 6 : 8" 
        :size="isMobile ? 'medium' : 'large'" 
        :page="pagination.page"
        :page-size="pagination.pageSize" 
        :item-count="pagination.total" 
        :page-sizes="[ 10, 20, 30, 40 ]"
        show-size-picker />
      </div>
    </div>
    <div class="list-container" v-else>
      <template v-if="list.length">
        <div class="list">
          <bar-item v-for="item in list" :key="item.bid" :bar="item"></bar-item>
        </div>
        <div class="pagination">
          <n-pagination 
          :page-slot="isMobile ? 6 : 8" 
          :size="isMobile ? 'medium' : 'large'" 
          :page="pagination.page"
          :page-size="pagination.pageSize" 
          :item-count="pagination.total" 
          :page-sizes="[ 10, 20, 30, 40 ]"
          show-size-picker 
          @update:page="onHandlePageUpdate" 
          @update:page-size="onHandlePageSizeUpdate" 
          />
        </div>
      </template>
      <template v-else>
        <div class="empty">
          <empty></empty>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang='ts' setup>
// apis
import { getAllBarListAPI } from '@/apis/all-bar';
// hooks
import { reactive, onBeforeMount } from 'vue'
import useIsMoblie from '@/hooks/useIsMoblie'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
// types
import type { BarItem as ItemType } from '@/apis/public/types/bar';
// utils
import { formatNumber } from '@/utils/tools';

// 响应式获取 窗口是否为650px以下的宽度？
const isMobile = useIsMoblie()
// 吧列表数据
const list = reactive<ItemType[]>([])
// 分页数据
const pagination = reactive({
  isLoading: false,
  page: 1,
  pageSize: 20,
  total: 0
})
const route = useRoute()
const router = useRouter()


// 获取数据的api
const getListData = async () => {
  pagination.isLoading = true
  list.length = 0
  const res = await getAllBarListAPI(pagination.page, pagination.pageSize, true)
  res.data.list.forEach(ele => list.push(ele))
  pagination.total = res.data.total
  pagination.isLoading = false
}

// 点击分页组件 页码更新的回调
const onHandlePageUpdate = (value: number) => {
  router.push({
    path: route.path,
    query: {
      page: value
    }
  })
}

// 点击分页组件 页长度更新的回调
const onHandlePageSizeUpdate = (value: number) => {
  pagination.pageSize = value
  // 重置页码
  router.push({
    path: route.path,
    query: {
      page: 1
    }
  })
}


// 初始化加载第一页的数据
onBeforeMount(async () => {
  // 若携带了路由 需要将page解析出来作为页面初始化加载的页码
  if (route.query.page !== undefined) {
    const temp = formatNumber(route.query.page as string)
    if (temp === false) {
      // 非法
      router.replace({
        path: route.path,
        query: {
          page: 1
        }
      })
      // 禁止加载数据
      return
    } else {
      // 合法
      pagination.page = temp
    }
  }
  await getListData()
})

// 路由更新的回调
onBeforeRouteUpdate(to => {
  // 解析最新的路由 更新页码
  if (to.query.page === undefined) {
    // 若未携带路由查询参数page
    router.replace({
      path: to.path,
      query: {
        page: 1
      }
    })
  } else {
    // 若携带了page
    const res = formatNumber(to.query.page as string)
    if (res === false) {
      // 若参数非法 重置为1
      // 这里会出现一个小bug 当page参数为一时
      // 通过url直接修改page参数使其非法 时
      // 会重新跳转到page=1 当时这样会导致路由相当于没更新 会让url中的page参数不变
      router.replace({
        path: to.path,
        query: {
          page: 1
        }
      })
      // 禁止加载数据 replace后会重新进入更新的回调
      return
    } else {
      // 若携带了 更新page
      pagination.page = res
    }
  }
  // 获取最新数据
  getListData()
})

defineOptions({
  name: 'AllBar'
})
</script>

<style scoped lang='scss'>
.page-container {
  display: flex;
  flex-direction: column;

  .loading {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }

  .empty {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .list-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px
    }


  }
}

@media screen and (max-width:650px) {
  .page-container {
    .list-container {
      .list {
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>