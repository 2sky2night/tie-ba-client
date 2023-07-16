<template>
  <div class="header-container">
    <Logo />
    <Navigaitons />
    <div class="content">
      <SearchBar class="mr-10"/>
      <Menu />
    </div>
  </div>
</template>

<script lang='ts' setup>
//components
import Navigaitons from './components/navigations/index.vue'
import Logo from './components/logo/index.vue'
import Menu from './components/menu/index.vue'
import SearchBar from './components/search/index.vue'
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
  .content{
    display: flex;
  }
}
</style>