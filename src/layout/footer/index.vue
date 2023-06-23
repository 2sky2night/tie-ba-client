<template>
  <div class="tab-bar-container">
    <TabBarItem v-for="item in tabBarList" :path="item.path" :title="item.title" :icon="item.icon" :key="item.path">
    </TabBarItem>
  </div>
</template>

<script lang='ts' setup>
// hooks
import { reactive,shallowReactive } from 'vue'
// components
import TabBarItem from './components/TabBarItem.vue';
// configs
import { authTabBar, noAuthTabBar } from './configs'
// types
import type { TabBarItemProps } from '@/types/components/layout'

const tabBarList: TabBarItemProps[] = shallowReactive(Object.assign([], noAuthTabBar))

defineOptions({
  name: 'TabBar'
})
</script>

<style scoped lang='scss'>
.tab-bar-container {
  height: 100%;
  display: flex;
}
</style>