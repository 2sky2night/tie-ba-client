<template>
  <div class="skeleton-list">
    <ArticleItemSkeleton class="mt-10" v-for="item in Array.from({length})"/>
  </div>
</template>

<script lang='ts' setup>
import ArticleItemSkeleton from '../item/ArticleItemSkeleton.vue';
import type { SkeletonListProps } from '@/types/components/skeleton'
defineProps<SkeletonListProps>()
</script>
