<template>
  <div class="menu-container">
    <n-dropdown trigger="hover" :options="menu" @select="onHandleSelect">

      <template v-if="userStore.isLogin">
        <n-avatar class="user" round :src="userData.avatar" />
      </template>

      <template v-else>
        <div class="guest">
          <n-icon size="20">
            <UserOutlined />
          </n-icon>
        </div>
      </template>

    </n-dropdown>
  </div>
</template>

<script lang='ts' setup>
// hooks
import { useRouter } from 'vue-router';
import { reactive, watch } from 'vue'
import useUserStore from '@/store/user';
import useThemeStore from '@/store/theme'
import { storeToRefs } from 'pinia';
// configs
import { authMenu, noAuthMenu, renderIcon, renderGuestTitle, renderUserTitle } from './configs'
// types
import { DropdownOption, NIcon } from 'naive-ui';
import { Actions } from './types'
// components
import { UserOutlined } from '@vicons/antd'
import { SunnyOutline, Moon } from '@vicons/ionicons5'

// 用户仓库
const userStore = useUserStore()
const { userData } = storeToRefs(userStore)
// 主题仓库
const themeStore = useThemeStore()
// 路由对象
const router = useRouter()

// 菜单(根据用户登录状态来渲染不同的菜单)
const menu = reactive<DropdownOption[]>([])

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
    switch (key as Actions) {
      case 'theme': themeStore.toToggleTheme(); break;
      case 'logout': userStore.toLogout(); break;
      default: console.log(key)
    }
  }
}

/**
 * 增加主题切换按钮
 */
const addThemeBtn = () => {
  if (themeStore.isDark) {
    menu.push({
      label: '深色模式',
      key: 'theme',
      icon: renderIcon(Moon)
    })
  } else {
    menu.push({
      label: '浅色模式',
      key: 'theme',
      icon: renderIcon(SunnyOutline)
    })
  }
}

// 登录状态发生变化 重新渲染菜单
watch(() => userStore.isLogin, (v: boolean) => {
  menu.length = 0
  if (v) {
    // 若为登录状态 则渲染用户菜单
    // @ts-ignore
    authMenu.forEach(ele => menu.push(ele))
    menu.unshift({
      key: 'header',
      type: 'render',
      render: () => renderUserTitle(userStore.userData.username, userStore.userData.avatar)
    })
  } else {
    // 若不为登录状态 渲染游客菜单
    noAuthMenu.forEach(ele => menu.push(ele))
    menu.unshift({
      key: 'header',
      type: 'render',
      render: renderGuestTitle
    })
  }
  addThemeBtn()
}, { immediate: true })


// 主题发生变化时,重新渲染菜单栏中的主题按钮
watch(() => themeStore.isDark, (v) => {

  menu.some(ele => {
    if (ele.key === 'theme') {
      if (v) {
        ele.label = '深色模式'
        ele.icon = renderIcon(Moon)
      } else {
        ele.label = '浅色模式'
        ele.icon = renderIcon(SunnyOutline)
      }
      return true
    }
  })
})

defineOptions({
  name: 'Menu'
})
</script>

<style scoped lang='scss'>
.menu-container {
  display: flex;
  align-items: center;

  .guest {
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid var(--border-color-1)
  }

  :deep(.user) {
    cursor: pointer;
  }
}
</style>