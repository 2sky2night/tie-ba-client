<template>
  <div :style="{ height: `${ height }px` }" ref="swiperCellDOM" class="swiper-cell-container">
    <div ref="container" class="container" :style="{ left: leftOffset + 'px' }">
      <div class="main-container" @touchstart="onHandleStart" @mousedown="onHandleDown" @click.capture="clickCaptrue">
        <slot></slot>
      </div>
      <div ref="rightContainer" class="right-container" v-if="$slots.right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
// 1.滑动单元格组件
// 为容器（容器为相对定位）里面嵌套一个主视图（主视图为绝对定位） 为了解决容器高度丢失
// 使用了ResizeObserve api来监听主视图高度动态设置容器高度
// 2.滑动动作判定
//  滑动动作是靠鼠标按下容器再移动鼠标 根据鼠标在按下时的x坐标与移动后的x坐标进行判断，若移动后大就需要往右移动，移动前大就往左移
//  但由于插槽用来展示主视图的，主视图往往存在点击事件等，为了不与滑动动作冲突 所以给组件绑定了click事件捕获点击事件并使用isSwiper来判断是否属于滑动动作触发的点击还是单纯的点击，从而在滑动动作触发时阻止事件捕获到后代元素
// types
import type { VNode } from 'vue';
// hooks
import { ref, onMounted, onBeforeUnmount } from 'vue';

// // 声明的插槽
// const slots = defineSlots<{
//   default: () => VNode[];
//   right?: () => VNode[]
// }>()
// 是否满足滑动的动作?
let isSwiper = false
// 滑块的DOM元素
const swiperCellDOM = ref<HTMLDivElement | null>(null)
// 偏移量
const leftOffset = ref(0)
// 主视图容器
const container = ref<HTMLDivElement | null>(null)
// 响应式获取主视图容器的高度 来设置组件容器的高度
const height = ref(0)
// 左视图容器的DOM
const rightContainer = ref<HTMLDivElement | null>(null)
// 左视图容器的宽度
let rightWidth = 0

// 适配pc端鼠标按下时的回调
const onHandleDown = (e: MouseEvent) => {
  // 主视图DOM
  const dom = container.value as HTMLDivElement
  // 获取鼠标按下时的x坐标 用来记录滑动的起始值
  const x = e.pageX
  // 每次按下都初始化滑动动作 
  // 必须完成 按下+鼠标移动 事件都触发才算是滑动动作
  isSwiper = false
  console.log("重置了滑动动作，要是鼠标按下时不移动鼠标就抬起会触发后代的点击事件哟")
  
  // 鼠标滑动时的回调
  function handleMove (eMove: MouseEvent) {
    // 移动了鼠标 算滑动动作
    isSwiper = true
    console.log('是滑动动作 取消点击事件的事件捕获');
    // 鼠标抬起时的处理函数
    dom.addEventListener('mouseup', handleUp)
    // 鼠标移出时的处理函数
    dom.addEventListener('mouseleave', handleLeave)
    if (eMove.pageX < x) {
      // 若滑动时x坐标小于按下时的坐标往左位移
      leftOffset.value = -rightWidth
    } else {
      // 往右滑动就重置归零
      leftOffset.value = 0
    }
  }

  // 鼠标抬起的回调 移除相应的事件监听
  function handleUp () {
    dom.removeEventListener('mousemove', handleMove);
    dom.removeEventListener('mouseup', handleUp);
    dom.removeEventListener('mouseleave', handleLeave)
  }

  // 鼠标移出时的回调 移除相应的事件监听
  function handleLeave () {
    dom.removeEventListener('mousemove', handleMove);
    dom.removeEventListener('mouseup', handleUp);
    dom.removeEventListener('mouseleave', handleLeave)
  }

  // 鼠标移动的处理函数
  dom.addEventListener('mousemove', handleMove);
}

// 适配移动端的鼠标按下回调
const onHandleStart = (e: TouchEvent) => {
  // 主视图DOM
  const dom = container.value as HTMLDivElement
  // 获取鼠标按下时的x坐标 用来记录滑动的起始值
  const x = e.targetTouches[0].pageX
  // 每次按下都初始化滑动动作 
  // 必须完成 按下+鼠标移动 事件都触发才算是滑动动作
  isSwiper = false
  console.log("重置了滑动动作，要是鼠标按下时不移动鼠标就抬起会触发后代的点击事件哟")

  // 鼠标滑动时的回调
  function handleMove (eMove: TouchEvent) {
    // 移动了鼠标 算滑动动作
    isSwiper = true
    console.log('是滑动动作 取消点击事件的事件捕获');
    // 鼠标抬起时的处理函数
    dom.addEventListener('touchend', handleUp)
    // 鼠标移出时的处理函数
    dom.addEventListener('touchcancel', handleLeave)
    if (eMove.targetTouches[0].pageX < x) {
      // 若滑动时x坐标小于按下时的坐标往左位移
      leftOffset.value = -rightWidth
    } else {
      // 往右滑动就重置归零
      leftOffset.value = 0
    }
  }

  // 鼠标抬起的回调 移除相应的事件监听
  function handleUp () {
    dom.removeEventListener('touchmove', handleMove);
    dom.removeEventListener('touchend', handleUp);
    dom.removeEventListener('touchcancel', handleLeave)
  }

  // 鼠标移出时的回调 移除相应的事件监听
  function handleLeave () {
    dom.removeEventListener('touchmove', handleMove);
    dom.removeEventListener('touchend', handleUp);
    dom.removeEventListener('touchcancel', handleLeave)
  }

  // 鼠标移动的处理函数
  dom.addEventListener('touchmove', handleMove);
}

// 点击事件捕获的回调 (满足滑动的动作就停止事件捕获 不满足就执行事件捕获)
const clickCaptrue = (e: Event) => {
  // 满足滑动的动作 就停止事件捕获
  if (isSwiper) {
    e.stopPropagation()
  }
}

// 对主视图容器进行高度监听 设置组件的高度
onMounted(() => {
  // 创建一个监听器 用来监听DOM元素的大小的变化 动态设置滑块组件的高度
  const observer = new ResizeObserver((e) => {
    height.value = e[ 0 ].target.clientHeight
  })
  // 让监听器作用在对应元素上 元素大小发生变化就会执行回调
  observer.observe((container.value as HTMLDivElement))
  // 组件卸载时 销毁监听器
  onBeforeUnmount(() => {
    // 销毁对主视图的监听
    observer.unobserve((container.value as HTMLDivElement))
  })
})
// 获取右视图的宽度 设置滑动偏移量的顶峰值
onMounted(() => {
  if (rightContainer.value) {
    rightWidth = rightContainer.value.clientWidth
  }
})

defineOptions({
  name: 'SwiperCell'
})
</script>

<style scoped lang='scss'>
.swiper-cell-container {
  position: relative;
  overflow: hidden;

  .container {
    position: absolute;
    display: flex;
    width: 100%;
    transition: var(--time-normal);

    .main-container {
      min-width: 100%;
    }
  }
}
</style>