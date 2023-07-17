<template>
  <div class="page-container">
    <div class="tabs-container">
      <n-tabs type='bar' :size="isMoblie?'medium':'large'" :value="route.path" :justify-content="isMoblie?'space-around':undefined" @update:value="onHandleChangeTabs">
        <n-tab v-for="item in routeList" :key="item.path" :name="item.path">
          {{ item.title }}
        </n-tab>
      </n-tabs>
    </div>
    <div class="route-enter">
      <RouterView #default="{ Component }">
        <Transition :name="name">
          <component :is="Component"></component>
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<script lang='ts' setup>
// hooks
import useUserStore from '@/store/user';
import { storeToRefs } from 'pinia';
import { computed, ref, watch,onMounted,onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router';
// configs
import { authNavigations, noAuthNavigations } from '@/layout/header/components/navigations/configs';

// 路由对象
const router = useRouter()
// 路由元数据
const route = useRoute()
// 是否登录
const { isLogin } = storeToRefs(useUserStore())
// tab面板项
const routeList = computed(() => {
  if (isLogin.value) {
    return authNavigations[ 1 ].children
  } else {
    return noAuthNavigations[ 1 ].children
  }
})
// 当前激活的面板索引
const currentIndex = ref(0)
// 当前切换tabs时的动画效果
const name = ref <'toRight'|'toLeft'>('toRight')
// 是否为移动端布局(650px以下)?
const isMoblie=ref(false)

// 切换tabs的回调
const onHandleChangeTabs = (path: string) => {
  router.push(path)
}

// 监听路由变化 记录当前激活的索引
watch(() => route.path, (v) => {
  routeList.value?.some((ele, index) => {
    if (ele.path === v) {
      currentIndex.value = index
      return true
    }
  })
}, { immediate: true })
// 监听当前索引的变化设置切换面板时的动画
watch(currentIndex, (v, o) => {
  if (v > o) {
    name.value='toRight'
  } else {
    name.value='toLeft'
  }
})

// 根据视口大小调整tabs的布局
onMounted(() => {
  function checkDiscoverTabs () {
    if (window.innerWidth <= 650) {
      isMoblie.value=true
    } else {
      isMoblie.value=false
    }
  }
  checkDiscoverTabs()
  window.addEventListener('resize', checkDiscoverTabs)
  onBeforeUnmount(() => {
    window.removeEventListener('resize',checkDiscoverTabs)
  })
})

defineOptions({
  name: 'Discover'
})
</script>

<style scoped lang='scss'>
.page-container {
  .route-enter {
    padding: 0 5px;
    margin-top: 10px;
  }
}

.toRight-enter-active{
  animation: toRight var(--time-normal) 1  ease;
}

.toLeft-enter-active{
  animation: toLeft var(--time-normal) 1  ease;
}

@keyframes toRight {
  from{
    transform: translateX(100%);
  }
  to{
    transform: none;
  }
}
@keyframes toLeft {
  from{
    transform: translateX(-100%);
  }
  to{
    transform: none;
  }
}
</style>