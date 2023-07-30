<template>
  <div class="panel-container">
    <n-tabs default-value="articles" :justify-content="tabIsCenter ? 'space-evenly' : 'start'" type="bar">
      <n-tab-pane name="articles" tab="帖子">
        <Articles :bid="bid" />
      </n-tab-pane>
      <n-tab-pane name="user" tab="关注">
        <FollowedUser :bid="bid" />
      </n-tab-pane>
      <n-tab-pane name="rank" tab="吧等级">
        <RankInfoVue :bid="bid" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script lang='ts' setup>
// components
import Articles from './components/Articles.vue'
import FollowedUser from './components/FollowedUser.vue';
import RankInfoVue from './components/RankInfo.vue';
// hooks
import { ref, onMounted, onBeforeUnmount } from 'vue'

// tab项目是否居中
const tabIsCenter = ref(false)
defineProps<{ bid: number }>()
// 根据视口宽度调整tab布局
onMounted(() => {
  function checkWindow() {
    if (window.innerWidth <= 650) {
      tabIsCenter.value = true
    } else {
      tabIsCenter.value = false
    }
  }
  checkWindow()
  window.addEventListener('resize', checkWindow)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkWindow)
  })
})
defineOptions({
  name: 'Panel'
})
</script>

<style scoped lang='scss'>
.panel-container {

  // border-top: 1px solid var(--border-color-1);
  :deep(.n-tabs-nav) {
    padding: 0 10px;
  }
}
</style>