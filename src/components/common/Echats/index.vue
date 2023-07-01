<template>
    <div class="echart-container" :style="{ width: width + 'px', height: height + 'px' }" ref="chartDom" />
</template>

<script lang='ts' setup>
import { init } from 'echarts'
// hooks
import { ref, onMounted } from 'vue'
// types 
import type { EchartsProps } from '@/types/components/common'

const props = defineProps<EchartsProps>()

const chartDom = ref<HTMLDivElement | null>(null)

onMounted(() => {
    if (chartDom.value) {
        // 渲染图表
        const myChart = init(chartDom.value);
        props.option && myChart.setOption(props.option);
    }
})

defineOptions({
    name: 'Echarts'
})
</script>

<style scoped lang="scss"> 
.echart-container{
    display: flex;
    align-items: center;
}
</style>
