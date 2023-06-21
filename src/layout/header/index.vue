<template>
  <div class="header-container">
    <Logo />
    <Navigaitons />
    <Menu />
  </div>
</template>

<script lang='ts' setup>
//components
import Navigaitons from './components/navigations/index.vue'
import Logo from './components/Logo/index.vue'
import Menu from './components/menu/index.vue'
defineOptions({
  name: 'Header'
})
</script>

<style scoped lang='scss'>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: var(--main-width);
  padding: 0 10px;
}
</style>