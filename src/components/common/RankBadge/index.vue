<template>
  <div class="rank-badge">
    <div class="top" :class="colorClass"></div>
    <div class="triangle" :class="colorClass"></div>
    <span class="level-text">{{ level }}</span>
  </div>
</template>

<script lang='ts' setup>
// hooks
import { computed } from 'vue'

// props
const props = defineProps<{ level: number; }>()
// class
const colorClass = computed(() => {
  if (props.level < 4) {
    return 'green'
  } else if (props.level < 10) {
    return 'blue'
  } else {
    return 'yellow'
  }
})

defineOptions({
  name: 'BankBadge'
})
</script>

<style scoped lang='scss'>
.rank-badge {
  position: relative;
  display: inline-block;

  .level-text {
    font-size: 12px;
    color: #fff;
    position: absolute;
    top: 1px;
    left: 50%;
    font-weight: 600;
    transform: translateX(-50%);
  }

  .top {
    width: 32px;
    height: 0;
    border-left: 8px solid transparent !important;
    border-right: 8px solid transparent !important;
    border-bottom: 10px solid;

    &.green {
      border-color: #5cd3ae;
    }

    &.blue {
      border-color: #83a6f4;
    }

    &.yellow {
      border-color: #e4b86b;
    }
  }

  .triangle {
    width: 0;
    height: 0;
    border-left: 16px solid transparent !important;
    border-right: 16.5px solid transparent !important;
    border-top: 15px solid;

    &.green {
      border-color: #5cd3ae;
    }

    &.blue {
      border-color: #83a6f4;
    }

    &.yellow {
      border-color: #e4b86b;
    }
  }
}</style>