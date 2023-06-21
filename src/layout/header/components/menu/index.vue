<template>
  <div class="menu-container">
    <n-dropdown trigger="hover" :options="menu" @select="onHandleSelect">
      <n-avatar class="user" round src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
    </n-dropdown>
  </div>
</template>

<script lang='ts' setup>
// hooks
import { useRouter } from 'vue-router';
import { reactive } from 'vue'
// configs
import { authMenu, noAuthMenu } from './configs'

// 路由对象
const router = useRouter()

// 菜单
const menu = reactive(Object.assign([],noAuthMenu))

/**
 * 点击下拉菜单的回调
 * @param key key值
 */
const onHandleSelect = (key: string) => {
  if (key.includes('/')) {
    // 包含/则为路由跳转
    router.push(key)
  } else {
    // 功能按钮 需要执行对应操作
    console.log(key)
  }
}

defineOptions({
  name: 'Menu'
})
</script>

<style scoped lang='scss'>
.menu-container {
  display: flex;
  align-items: center;
  :deep(.user) {
    cursor: pointer;
  }
}
</style>