<template>
  <n-config-provider :theme-overrides="theme" :theme="themeStore.theme" :locale="zhCN">
    <n-message-provider>
      <Layout />
      <n-global-style />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
// components
import Layout from '@/layout/index.vue'
// configs
import theme from './config/theme'
// hooks
import useThemeStore from '@/store/theme'
import { zhCN } from 'naive-ui'

const themeStore = useThemeStore()

// 若当前为深色主题 则设置对应深色主题
if (themeStore.isDark) {
  themeStore.setDarkTheme()
}

</script>

<style  lang="scss">
@import url('@/styles/reset.scss');

.page-container {
  max-width: 100vw;
  box-sizing: border-box;
  min-height: calc(100vh - var(--header-hight));
  padding: 20px;
}

@media screen and (max-width:650px) {
  .page-container {
    min-height: calc(100vh - var(--header-hight) - var(--footer-hight));
    padding: 10px;
  }
}
</style>
