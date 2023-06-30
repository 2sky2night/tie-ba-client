<template>
  <div @click.capture="(e)=>onHandleClick(e)" class="auth-btn-container">
    <slot name="default"></slot>
  </div>
</template>

<script lang='ts' setup>
// hooks
import useUserStore from '@/store/user';
import { useMessage } from 'naive-ui';
// types
import type { VNode } from 'vue';
// configs
import tips from '@/config/tips';

const message = useMessage()
const userStore = useUserStore()

/**
 * 点击的该容器的回调 在捕获时触发
 */
const onHandleClick =  (e:Event) => {
  if (!userStore.isLogin) {
    message.warning(tips.pleaseLogin)
    // 停止事件捕获 阻止继续事件捕获
    e.stopImmediatePropagation()
  }
}

defineSlots<{
  default:()=>VNode[]
}>()
</script>