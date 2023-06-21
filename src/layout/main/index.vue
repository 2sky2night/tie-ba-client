<template>
  <div class="main-container">
    <n-scrollbar ref="scrollIns" style="max-height: 100%">
      <RouterView />
    </n-scrollbar>
  </div>
</template>

<script lang='ts' setup>
// hooks
import { useRoute } from 'vue-router';
import { watch, ref } from 'vue';
// types 
import type { ScrollbarInst } from 'naive-ui'

const route = useRoute()
const scrollIns = ref<ScrollbarInst | null>(null)

// 监听路由url更新时页面滚动置顶部
watch(() => route.fullPath, () => {
  if (scrollIns.value) {
    scrollIns.value.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }
})

</script>

<style scoped lang='scss'>
.main-container {
  margin: 0 auto;
  width: var(--main-width);
  background-color: skyblue;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - var(--header-hight));
}

// 显示tabbar
@media screen and (max-width:800px) {
  .main-container {
    height: calc(100vh - var(--header-hight) - var(--footer-hight));
  }
}
</style>