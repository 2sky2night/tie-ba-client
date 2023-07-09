<template>
  <div class="skeleton-list">
    <CommentSkeleton class="mt-10" v-for="item in Array.from({ length })" />
  </div>
</template>

<script lang='ts' setup>
import CommentSkeleton from '@/components/skeleton/item/CommentSkeleton.vue'
import type { SkeletonListProps } from '@/types/components/skeleton'
defineProps<SkeletonListProps>()
</script>
