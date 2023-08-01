<template>
  <div class="ranking">
    <!--等级分区图-->
    <Suspense>
      <RankingDis :bid="bid"></RankingDis>
      <template #fallback>
        <div class="loading">
          <span class="sub-text mr-5">正在加载</span>
          <n-spin></n-spin>
        </div>
      </template>
    </Suspense>
    <!--排行榜-->
    <RankingList class="mt-10" :bid="bid"></RankingList>
  </div>
</template>

<script lang='ts' setup>
// components
import RankingDis from './components/RankingDis.vue';
import RankingList from './components/RankingList.vue';
defineProps<{ bid: number }>()
defineOptions({
  name: 'BarRanking'
})
</script>
<style scoped lang="scss">
.loading{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10vh 0;
}
</style>