<template>
  <div class="panel-container">
    <n-tabs :value="selectTabs" @update:value="onHandleUpdateTabs" :justify-content="isMoblie ? 'space-evenly' : 'start'"
      type="bar">
      <n-tab-pane name="articles" tab="帖子" :display-directive="'show:lazy'">
        <Articles :bid="bid" />
      </n-tab-pane>
      <n-tab-pane name="user" tab="关注" :display-directive="'show:lazy'">
        <FollowedUser :bid="bid" />
      </n-tab-pane>
      <n-tab-pane name="level-rules" tab="等级规则" :display-directive="'show:lazy'">
        <LevelRules :bid="bid" />
      </n-tab-pane>
      <n-tab-pane name="ranking" tab="等级排行榜">
        <Ranking :bid="bid"></Ranking>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script lang='ts' setup>
// components
import Articles from './components/article/index.vue'
import FollowedUser from './components/followed-user/index.vue';
import LevelRules from './components/level-rules/index.vue';
import Ranking from './components/ranking/index.vue'
// hooks
import useIsMobile from '@/hooks/useIsMobile'
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue'
// utils
import { formatNumber } from '@/utils/tools'
import { onBeforeRouteUpdate } from 'vue-router';

// 路由对象
const router = useRouter()
// 路由元信息
const route = useRoute()
// 当前激活的面板
const selectTabs = ref<'articles' | 'user' | 'level-rules' | 'ranking'>('articles')
// 是否为响应式获取当前是否为650px以下的视口宽度
const isMoblie = useIsMobile()
// props
defineProps<{ bid: number }>()

// 解析当前路由获取当前需要激活的面板
const getRouteTabs = (currentRoute = route) => {
  if (currentRoute.query.tabs === undefined) {
    // 未携带面板参数 默认浏览文章
    router.replace({
      ...route,
      query: {
        ...route.query,
        tabs: 1
      }
    })
  } else {
    // 携带了 检验是否合法
    const tabs = formatNumber(currentRoute.query.tabs as string)
    if (tabs === false || tabs < 1 || tabs > 4) {
      // 参数非法 重置为0
      router.replace({
        ...route,
        query: {
          ...route.query,
          tabs: 1
        }
      })
    } else {
      // 参数合法
      switch (tabs as 1 | 2 | 3 | 4) {
        case 1: selectTabs.value = 'articles'; break;
        case 2: selectTabs.value = 'user'; break;
        case 3: selectTabs.value = 'level-rules'; break;
        case 4: selectTabs.value = 'ranking'; break;
      }
    }
  }
}

// 初始化获取当前需要激活的面板
getRouteTabs()

// tabs切换时的回调
const onHandleUpdateTabs = (value: 'articles' | 'user' | 'level-rules' | 'ranking') => {
  // 进行路由跳转
  switch (value) {
    case 'articles': router.push({
      ...route,
      query: {
        ...route.query,
        tabs: 1
      }
    }); break;
    case 'user': router.push({
      ...route,
      query: {
        ...route.query,
        tabs: 2
      }
    }); break;
    case 'level-rules': router.push({
      ...route,
      query: {
        ...route.query,
        tabs: 3
      }
    }); break;
    case 'ranking': router.push({
      ...route,
      query: {
        ...route.query,
        tabs: 4
      }
    }); break;
  }
}

// tabs查询参数更新时的回调
onBeforeRouteUpdate(to => { getRouteTabs(to) })

defineOptions({
  name: 'Panel'
})
</script>

<style scoped lang='scss'>
.panel-container {

  // border-top: 1px solid var(--border-color-1);
  :deep(.n-tabs-nav) {
    padding: 0 10px;
  }
}
</style>