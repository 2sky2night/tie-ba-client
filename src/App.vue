<template>
  <n-config-provider :theme-overrides="theme">
    <n-message-provider>
      <Layout />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
// components
import Layout from '@/layout/index.vue'
// configs
import theme from './config/theme'
</script>

<style  lang="scss">
@import url('@/styles/reset.scss');

.page-container {
  min-height: calc(100vh - var(--header-hight));
}

@media screen and (max-width:650px) {
  .page-container {
    min-height: calc(100vh - var(--header-hight) - var(--footer-hight));
  }
}
</style>
