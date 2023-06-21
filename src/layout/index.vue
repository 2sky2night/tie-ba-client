<template>
  <div class="layout-container">
    <div class="header-content">
      <Header />
    </div>
    <div class="main-content">
      <Main />
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

  .header-content {
    display: flex;
    justify-content: center;
    min-height: var(--header-hight);
    border-bottom: 1px solid var(--border-color-1);
  }

  .main-content {
    display: flex;
    flex-grow: 1;
  }

  .footer-content {
    border-top: 1px solid var(--border-color-1);
    display: none;
    box-shadow: 0 -5px 10px var(--shadow-color-1);
    min-height: var(--footer-hight);
  }
}

@media screen and (max-width:800px) {
  .layout-container {
    .footer-content {
      display: block
    }
  }
}
</style>