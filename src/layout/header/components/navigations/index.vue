<template>
  <div class="nav-container">
    <template v-for="item in routesList">
      
      <template v-if="item.children">
        <NavigationItem :key="item.path" :path="item.path" :title="item.title" :children="item.children" />
      </template>

      <template v-else>
        <NavigationItem :key="item.path" :path="item.path" :title="item.title" />
      </template>

    </template>
  </div>
</template>

<script lang='ts' setup>
// configs
import { authNavigations, noAuthNavigations } from './configs'
// components
import NavigationItem from './components/NavigationItem.vue';
// hooks
import { reactive } from 'vue'

const routesList = reactive(JSON.parse(JSON.stringify(noAuthNavigations)))

defineOptions({
  name: 'Navigations'
})
</script>

<style scoped lang='scss'>
.nav-container {
  display: flex;
}
</style>