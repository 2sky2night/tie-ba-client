<template>
  <div class="main-container">
    <RouterView #default="{Component}">
      <KeepAlive :includes="['Home']">
        <component :is="Component" ></component>
      </KeepAlive>
    </RouterView>
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
  background-color: var(--bg-color-2);
  min-height: calc(100vh - var(--header-hight));
}

@media screen and (max-width:650px) {
  .main-container {
    min-height: calc(100vh - var(--header-hight) - var(--footer-hight));
  }
}
</style>