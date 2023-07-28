<template>
  <div class="progress-bar-container" :class="{ [ `size-${ size }` ]: true }">
    <div :style="style" class="progress-content"></div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: number;
  size?: 'small' | 'medium' | 'large'
}>(), { size: 'medium' })

console.log(props.value);
const style = computed(() => {
  return {
    width:`${props.value*100}%`
  }
})

defineOptions({
  name: 'ProgressBar'
})
</script>

<style scoped lang='scss'>
.progress-bar-container {
  background: var(--bg-color-3);
  border-radius: 10px;
  overflow: hidden;

  &.size-large {
    height: 20px;
  }

  &.size-medium {
    height: 15px;
  }

  &.size-small {
    height: 10px;
  }

  .progress-content {
    background-color: var(--primary-color);
    transition: var(--time-normal);
    height: 100%;
    border-radius: 10px;
  }
}
</style>