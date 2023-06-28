<template>
  <div class="main-container">
    <RouterView />
  </div>
</template>

<script lang='ts' setup>

defineOptions({
  name: 'Main'
})
</script>

<style scoped lang='scss'>
.main-container {
  margin: 0 auto;
  width: var(--main-width);
}

// 显示tabbar
@media screen and (max-width:650px) {
  .main-container {
    height: calc(100vh - var(--header-hight) - var(--footer-hight));
  }
}
</style>