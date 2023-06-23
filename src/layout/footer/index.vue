<template>
  <div class="tab-bar-container">
    <TabBarItem v-for="item in tabBarList" :path="item.path" :title="item.title" :icon="item.icon" :key="item.path" />
  </div>
</template>

<script lang='ts' setup>
// hooks
import { watch,shallowReactive } from 'vue'
import useUserStore from '@/store/user'
// components
import TabBarItem from './components/TabBarItem.vue';
// configs
import { authTabBar, noAuthTabBar } from './configs'
// types
import type { TabBarItemProps } from '@/types/components/layout'

const userStore = useUserStore()

const tabBarList = shallowReactive<TabBarItemProps[]>([])

// 监听登录状态, 登录状态更新更新顶部tabbar
watch(() => userStore.isLogin, (v) => {
  tabBarList.length = 0
  if (v) {
    authTabBar.forEach(ele => tabBarList.push(ele))
  } else {
    noAuthTabBar.forEach(ele => tabBarList.push(ele))
  }
}, { immediate: true })

defineOptions({
  name: 'TabBar',
})
</script>


<style scoped lang='scss'>
.tab-bar-container {
  height: 100%;
  display: flex;
}
</style>