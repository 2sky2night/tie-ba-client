<template>
  <div class="logo-container" @click.stop="">
    <div class="trigger" @click="isShow = !isShow" :class="{ 'active': isShow }">
      <div class="item mb-5"></div>
      <div class="item mb-5"></div>
      <div class="item"></div>
    </div>
    <div class="navs" :class="{ 'active': isShow }">
      <template v-for="item in routeList">
        <template v-if="item.children">
          <NavigationItem :path="item.path" :key="item.path" :title="item.title" :children="item.children" v-model:is-show="isShow" />
        </template>
        <template v-else>
          <NavigationItem :path="item.path" :key="item.path" :title="item.title" v-model:is-show="isShow" />
        </template>
      </template>
    </div>
  </div>
</template>

<script lang='ts' setup>
// configs
import { noAuthNavigations, authNavigations } from '../navigations/configs'
// hooks
import useUserStore from '@/store/user';
import { storeToRefs } from 'pinia';
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
// components
import NavigationItem from './components/NavigationItem.vue';

// 是否显示菜单栏
const isShow = ref(false)
// 是否登录
const { isLogin } = storeToRefs(useUserStore())
// 路由导航项
const routeList = computed(() => {
  if (isLogin.value) {
    return authNavigations
  } else {
    return noAuthNavigations
  }
})

onMounted(() => {
  function toHiddenNav () {
    isShow.value = false
  }
  document.documentElement.addEventListener('click', toHiddenNav)
  onBeforeUnmount(() => {
    document.documentElement.removeEventListener('click', toHiddenNav)
  })
})

defineOptions({
  name: 'Logo'
})
</script>

<style scoped lang='scss'>
.logo-container {
  width: 0;
  overflow: hidden;
  transition: var(--time-normal);
  position: relative;

  .trigger {
    &.active {
      .item:nth-child(1) {
        transform: rotate(45deg) translateY(4px) translateX(0px);
      }

      .item:nth-child(2) {
        display: none;
      }

      .item:nth-child(3) {
        transform: rotate(-45deg) translateX(0px) translateY(-5px);
      }
    }
  }

  .navs {
    box-shadow: 0 0 10px var(--shadow-color-1);
    position: absolute;
    padding: 5px;
    background-color: var(--bg-color-1);
    border-radius: 3px;
    left: -5px;
    top: 50px;
    width: 120px;
    display: none;
    &.active {
      display: block;
      animation: enter var(--time-normal) ease-in 1;
    }

    @keyframes enter {
      from{
        opacity: .3;
      }
      to{
        opacity:1;
      }
    }

    &::after {
      content: '';
      width: 8px;
      height: 8px;
      position: absolute;
      top: -4px;
      left: 12px;
      transform: rotate(45deg);
      background-color: var(--bg-color-1);
    }
  }

  .trigger {
    height: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;

    .item {
      transition: var(--time-normal);
      width: 30px;
      height: 2px;
      background-color: var(--text-color-2);
    }

  }
}

@media screen and (max-width:650px) {
  .logo-container {
    width: auto;
    overflow: unset;
  }
}
</style>