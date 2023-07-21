<template>
  <div class="page-container">
    <!-- <div class="about-module">
      <div class="page-title">关于</div>

    </div> -->
    <div class="update-module">
      <div class="page-title mb-10">更新日志</div>
      <n-timeline>
        <n-timeline-item v-for="item in updateLogs" :type="item.type" :content="item.content" :time="formatDBDateTime(item.time)" :title="item.title" />
      </n-timeline>
    </div>
  </div>
</template>

<script lang='ts' setup>
import {updateLogs} from './configs'
import {formatDBDateTime} from '@/utils/tools'

defineOptions({
  name: 'about'
})
</script>

<style scoped lang='scss'></style>