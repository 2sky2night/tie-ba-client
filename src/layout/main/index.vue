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
</style>