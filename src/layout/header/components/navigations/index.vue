<template>
  <div class="nav-container">
    <template v-for="item in routesList">

      <template v-if="item.children">
        <!--解决在登陆状态切换时组件复用的问题导致错误的渲染二级导航-->
        <NavigationItem :key="item.path+Date.now()" :path="item.path" :title="item.title" :children="item.children" />
      </template>

      <template v-else>
        <NavigationItem :key="item.path" :path="item.path" :title="item.title" />
      </template>

    </template>
  </div>
</template>

<script lang='ts' setup>
// configs
import { authNavigations, noAuthNavigations } from './configs'
// components
import NavigationItem from './components/NavigationItem.vue';
// hooks
import { reactive, watch } from 'vue'
import useUserStore from '@/store/user'
//types 
import type { NavigationItemProps } from '@/types/components/layout'

const userStore = useUserStore()

const routesList = reactive<NavigationItemProps[]>([])

// 根据登录状态动态渲染导航栏
watch(() => userStore.isLogin, (v) => {
  routesList.length = 0
  if (v) {
    // 登录了
    authNavigations.forEach(ele => routesList.push(ele))
  } else {
    // 未登录
    noAuthNavigations.forEach(ele => routesList.push(ele))
  }
}, { immediate: true })

defineOptions({
  name: 'Navigations'
})
</script>

<style scoped lang='scss'>
.nav-container {
  display: flex;
}
</style>