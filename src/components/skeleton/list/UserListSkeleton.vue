<template>
  <div class="list-skeleton">
    <UserItemSkeleton v-for="item in Array.from({length})" />
  </div>
</template>

<script lang='ts' setup>
import UserItemSkeleton from '../item/UserItemSkeleton.vue';
defineProps<{length:number}>()
</script>

<style scoped lang='scss'>
.list-skeleton{
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap:10px;
}
@media screen and (max-width:650px) {
  .list-skeleton{
    display: flex;
    flex-direction: column;
  }
}
</style>