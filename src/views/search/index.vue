<template>
  <div class="page-container" @click="onHandleCloseSearchHistory">
    <div class="page-title mb-10">搜索</div>
    <!--tabs栏-->
    <n-tabs :size="isMoblie ? 'medium' : 'large'" @update:value="onHandleChangeTab" :value="route.path" type='bar'
      class="mb-10">
      <n-tab v-for="item in tabList" :key="item.path" :name="item.path">
        {{ item.title }}
      </n-tab>
    </n-tabs>
    <!--搜索容器-->
    <SearchBox :is-moblie="isMoblie" />
    <!--二级路由入口-->
    <div class="route-enter">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script lang='ts' setup>
// hooks
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router';
// configs
import PubSub from 'pubsub-js';
// components
import SearchBox from './components/SearchBox.vue';

// route路由元数据
const route = useRoute()
// tab栏
const tabList = [
  {
    title: '帖子',
    path: '/search/article'
  },
  {
    title: '吧',
    path: '/search/bar'
  },
  {
    title: '评论',
    path: '/search/comment'
  },
  {
    title: '用户',
    path: '/search/user'
  }
]
// 宽度是否处于650px以下
const isMoblie = ref(false)
// 路由对象
const router = useRouter()

// 切换面板的回调
const onHandleChangeTab = (v: string) => {
  if (route.query.keywords) {
    router.push({
      path: v,
      query: {
        ...route.query,
        keywords: route.query.keywords
      }
    })
  } else {
    router.push(v)
  }
}

// 监听窗口宽度 来适配组件的大小
onMounted(() => {
  function setSearchPageSize() {
    if (window.innerWidth <= 650) {
      isMoblie.value = true
    } else {
      isMoblie.value = false
    }
  }
  setSearchPageSize()
  window.addEventListener('resize', setSearchPageSize)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', setSearchPageSize)
  })
})

// 点击页面元素 通知搜索容器隐藏历史记录
const onHandleCloseSearchHistory = () => {
  PubSub.publish('closeHistory')
}

defineOptions({
  name: 'Search'
})

</script>

<style scoped lang='scss'>
.page-container {
  display: flex;
  flex-direction: column;

  .route-enter {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    /**子容器选择器*/
    >div.search-result-container {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
}</style>