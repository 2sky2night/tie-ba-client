<template>
  <div class="list-skeleton">
    <BarItemSkeleton v-for="item in Array.from({ length })" />
  </div>
</template>

<script lang='ts' setup>
import BarItemSkeleton from '@/components/skeleton/item/BarItemSkeleton.vue';
import type { SkeletonListProps } from '@/types/components/skeleton'
defineProps<SkeletonListProps>()
</script>

<style scoped lang="scss">
.list-skeleton {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px
}

@media screen and (max-width:650px) {
  .list-skeleton {
    display: flex;
    flex-direction: column;
  }

}
</style>