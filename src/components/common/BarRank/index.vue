<template>
  <div class="rank-info">
    <RankBagde :level="level" />
    <span>{{ label }}</span>
  </div>
</template>

<script lang='ts' setup>
import RankBagde from '@/components/common/RankBadge/index.vue'

defineProps<{ level: number; label: string }>()

</script>

<style scoped lang='scss'>
.rank-info {
  display: flex;
  >div {
    margin-right: 5px;
    transition: all ease var(--time-normal);
  }

  span {
    font-size: 12px;
    color: var(--text-color-2);
  }
}

@media screen and (max-width:650px) {
  .rank-info {
    >div {
      transform: scale(.8);
      margin-right: 0px;
    }

    span {
      position: relative;
      top: 1.5px;
    }
  }
}</style>