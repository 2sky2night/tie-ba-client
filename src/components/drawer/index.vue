<template>
  <Transition name="show" appear>
    <div v-if="isShow" @click.stop class="drawer-content">
      <div class="header">
        <div class="close" @click="onHandleToClose">
          <n-icon>
            <Close />
          </n-icon>
        </div>
        <div class="title">
          {{ title }}
        </div>
      </div>
      <div class="main">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script lang='ts' setup>
// hooks
import { ref, provide, onMounted, onBeforeUnmount } from 'vue'
// componets
import { Close } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui';

// 是否显示模态框主视图
const isShow = ref(true)
// props
defineProps<{ title: string }>()
// emits
const emits = defineEmits<{
  'closeDrawer': []
}>()

// 移出模态框主视图
const onHandleClose = () => {
  // 移出模态框
  isShow.value = false
  // 动画效果完成时 promise凝固状态为成功
  return new Promise<void>(r => {
    setTimeout(() => {
      r()
    }, 300)
  })
}

// 按esc可以关闭抽屉
const onHandelKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    // 按下了esc建 关闭抽屉
    onHandleToClose()
  }
}

// 点击关闭按钮的回调
const onHandleToClose = () => {
  emits('closeDrawer')
  // 关闭时移除事件监听
  window.removeEventListener('keyup', onHandelKeyDown)
}

// 给后代注入关闭抽屉的操作
provide('onHandleToClose', onHandleToClose)

// 按esc可以关闭抽屉
onMounted(() => {
  window.addEventListener('keyup', onHandelKeyDown)
})

defineExpose({
  onHandleClose
})

defineOptions({
  name: 'Drawer'
})
</script>

<style scoped lang='scss'>
.drawer-content {
  background-color: var(--bg-color-1);
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 90vh;

  .header {
    height: 40px;
    text-align: center;
    font-size: 17px;
    font-weight: 600;
    color: var(--primary-color);
    padding: 5px 10px;
    border-bottom: 1px solid var(--border-color-1);
    position: relative;

    .close {
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      position: absolute;
      color: var(--text-color-2);
      font-size: 20px;
      transition: var(--time-normal);
      cursor: pointer;

      &:hover {
        color: var(--primary-color)
      }
    }
  }
}

.show-enter-active {
  animation: moveDrawer 1 var(--time-normal) ease
}

.show-leave-active {
  animation: moveDrawer 1 var(--time-normal) ease reverse
}

@keyframes moveDrawer {
  from {
    transform: translateY(100%);
  }

  to {
    transform: none;
  }
}</style>