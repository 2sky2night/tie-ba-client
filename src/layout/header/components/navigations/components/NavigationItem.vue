<template>
  <div class="nav-item-container">

    <!--有子路由-->
    <template v-if="children">
      <n-dropdown trigger="hover" :options="options" @select="onHandleSelect">
        <n-button :style="{marginRight:'5px'}" :type="isActive ? 'primary' : 'default'" :quaternary="!isActive" @click="onNavigationTo">
          {{ title }}
        </n-button>
      </n-dropdown>
    </template>

    <!--无子路由-->
    <template v-else>
      <n-button :style="{marginRight:'5px'}" :type="isActive ? 'primary' : 'default'" :quaternary="!isActive" @click="onNavigationTo">
        {{ title }}
      </n-button>
    </template>

  </div>
</template>

<script lang='ts' setup>
// types 
import type { NavigationItemProps } from '@/types/components/layout'
import type { DropdownOption } from 'naive-ui';
// hooks
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue'

// 路由对象
const router = useRouter()

// 路由元信息
const route = useRoute()

// 自定义属性
const props = defineProps<NavigationItemProps>()

// 下拉菜单项
const options: DropdownOption[] = props.children ? props.children.map(ele => {
  return {
    key: ele.path,
    label: ele.title
  }
}) : []

/**
 * 选择某个子路由后的回调 执行路由跳转
 * @param path 某个路由的路径
 */
const onHandleSelect = (path: string) => {
  router.push(path)
}

/**
 * 导航一级路由
 */
const onNavigationTo = () => {
  router.push(props.path)
}

/**
 * 若激活了当前路由或子路由就会高亮
 */
const isActive = computed(() => {
  return route.matched.some(ele => ele.path === props.path)
})

</script>