<template>
  <div @click="onHandleClick" class="tab-bar-container" :class="{'active':isActive}">
    <NIcon size="25">
      <component :is="icon"></component>
    </NIcon>
    <span class="title">{{ title }}</span>
  </div>
</template>

<script lang='ts' setup>
// types 
import type { TabBarItemProps } from '@/types/components/layout'
// hooks
import { useRoute,useRouter } from 'vue-router';
import {computed} from 'vue'

// 自定义属性
const props = defineProps<TabBarItemProps>()
// 路由元信息
const route = useRoute()
// 路由对象
const router = useRouter()

// 是否激活
const isActive = computed(() => {
  return route.matched.some(ele=>ele.path===props.path)
})

const onHandleClick = () => {
  router.push(props.path)
}
</script>

<style scoped lang='scss'>
.tab-bar-container{
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--time-normal);
  flex-direction: column;
  cursor: pointer;
  .title{
    font-size: 12px;
  }
  &.active{
    color:var(--primary-color)
  }
}
</style>