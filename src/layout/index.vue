<template>
  <div class="layout-container">
    <div class="header-content">
      <Header />
    </div>
    <div class="main-content">
      <n-scrollbar ref="scrollIns" style="max-height: 100%;">
        <Main />
      </n-scrollbar>
    </div>
    <div class="footer-content">
      <Footer />
    </div>
  </div>
</template>

<script lang='ts' setup>
// components
import Header from './header/index.vue'
import Main from './main/index.vue'
import Footer from './footer/index.vue'
// hooks
import { useMessage } from 'naive-ui'
import { useRoute } from 'vue-router';
import { watch, ref, provide, onMounted } from 'vue';
// types 
import type { ScrollbarInst } from 'naive-ui'
import pubsub from 'pubsub-js';

const route = useRoute()
const scrollIns = ref<ScrollbarInst | null>(null)
// 是否滚动到底部了
const isBottom = ref(false)
// 是否滚动到顶部了
const isTop = ref(true)
// 向后代组件注入是否滚动到底部了
provide('isBottom', isBottom)
// 向后代组件注入是否滚动到顶部了
provide('isTop', isTop)
// 离开首页时滚动条卷上去的高度
let homeScrollTop = 0


// 监听路由url更新时Main组件视图滚动置顶部
watch(() => route.fullPath, () => {

  // 为了保证在离开首页时 先触发pubsub的离开首页的消息
  // 再执行该监听的回调 所以就用了红任务 保证pubsub先执行再执行watch回调
  setTimeout(() => {
    console.log('滚动条滚动到顶部---watch');
    if (route.path === '/') {
      // 若进入了首页 就根据卷上去的高度来判断是否滚动到了顶部
      isTop.value = homeScrollTop === 0 ? true : false
      scrollIns.value?.scrollTo({
        top: homeScrollTop,
        left: 0
      })
    } else {
      // 进入不需要缓存滚动条的其他页面 直接记录isTop=true
      isTop.value = true
      scrollIns.value?.scrollTo({
        top: 0,
        left: 0
      })
    }
  })
})

onMounted(() => {

  // @ts-ignore (给滚动组件容器绑定滚动事件 只要滚动到底部)
  const t = scrollIns.value.$el.nextElementSibling.children[ 0 ] as HTMLDivElement

  // 滚动组件的滚动事件
  function scrollHandle (e: Event) {
    const div = e.target as HTMLDivElement
    console.log('滚动条监听....')
    // 若卷上去的高度 大于等于 （总高度-容器高度） 说明滚动到底部了
    // scolltop是卷上去的高度 clientHight是当前容器高度
    // scrollHiehgt是子容器的高度（是滚动条总的高度）
    // -10为了减小误差
    if (Math.round(div.scrollTop) >= div.scrollHeight - div.clientHeight - 10) {
      console.log('滚动到底部了')
      isBottom.value = true
    } else {
      isBottom.value = false
    }
    // 计算是否滚动到顶部了
    if (div.scrollTop === 0) {
      isTop.value = true
    } else {
      isTop.value = false
    }
  }

  // 监听后代组件是否监听滚动条高度
  pubsub.subscribe('watchScroll', (_, v: boolean) => {
    if (v) {
      // 开启事件监听
      console.log('开启滚动监听')
      t.addEventListener('scroll', scrollHandle)
    } else {
      // 关闭事件监听 节约性能 重置是否滚动到底部
      console.log('移除滚动监听')
      isBottom.value = false
      t.removeEventListener('scroll', scrollHandle)
    }
  })

  // 监听是否需要让主视图滚动到顶部
  pubsub.subscribe('toScrollTop', () => {
    if (scrollIns.value) {
      scrollIns.value.scrollTo({
        top: 0,
        left: 0
      })
    }
  })

  // 监听离开首页时 记录离开首页时滚动条卷上去的高度
  pubsub.subscribe('leaveHome', () => {
    console.log('离开首页了----leaveHome', t.scrollTop);
    homeScrollTop = t.scrollTop
  })

})

// 给window属性挂在消息组件API
window.$message = useMessage()

defineOptions({
  name: 'Layout'
})
</script>

<style scoped lang='scss'>
.layout-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color-3);
  overflow: hidden;

  .header-content {
    display: flex;
    justify-content: center;
    min-height: var(--header-hight);
    background-color: var(--bg-color-2);
    border-bottom: 1px solid var(--border-color-1);
    box-shadow: 0 0px 10px var(--shadow-color-1);
    z-index: 10;

  }

  .main-content {
    height: calc(100vh - var(--header-hight));
    // overflow: hidden;

    :deep(.n-scrollbar-content) {
      display: flex;
    }
  }

  .footer-content {
    border-top: 1px solid var(--border-color-1);
    display: block;
    box-shadow: 0 -5px 10px var(--shadow-color-1);
    min-height: var(--footer-hight);
    background-color: var(--bg-color-2);
    transition: all ease var(--time-normal);
    transform: translateY(100%);
  }
}

@media screen and (max-width:650px) {
  .layout-container {
    .footer-content {
      transform: translateY(0%);
    }

    .main-content {
      height: calc(100vh - var(--header-hight) - var(--footer-hight));
    }
  }
}
</style>