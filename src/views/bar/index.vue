<template>
  <div class="page-container">
    <template v-if="bid !== null">
      <BarInfo :bid="bid" />
      <Panel class="mt-10" :bid="bid" />
      <Actions />
    </template>
  </div>
</template>

<script lang='ts' setup>
// hooks
import useCheckRoutes from '@/hooks/useCheckRoutes';
import { ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router';
// components
import BarInfo from './components/BarInfo/index.vue'
import Panel from './components/Panel/index.vue'
import Actions from './components/Actions/index.vue';

// 路由的钩子
const checkRoute = useCheckRoutes('bid')
// 吧id
const bid = ref(checkRoute())

// 路由更新的回调 获取最新的参数值
onBeforeRouteUpdate(to => {
  bid.value = checkRoute(to)
})
defineOptions({
  name: 'Bar'
})
</script>