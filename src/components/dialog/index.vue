<template>
  <div class="dialog-content">
    <div class="header">

    </div>
    <div class="main">
      <slot></slot>
    </div>
    <div class="footer">

    </div>
  </div>
</template>

<script lang='ts' setup>
import type { VNode } from 'vue';

defineSlots<{
  default:()=>VNode[]
}>()
const props = defineProps<{
  title: string;
}>()
defineOptions({
  name:'Dialog'
})
</script>

<style scoped lang='scss'>
.dialog-content{

}
</style>