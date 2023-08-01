<template>
    <div class="echart-container" :style="{ width: width + 'px', height: height + 'px' }" ref="chartDom" />
</template>

<script lang='ts' setup>
import { init } from 'echarts'
// hooks
import { ref, onMounted, watch,nextTick } from 'vue'
import useThemeStore from '@/store/theme';
import { storeToRefs } from 'pinia';
// types 
import type { EchartsProps } from '@/types/components/common'
import type { EChartsType } from 'echarts'

// 主题仓库
const { isDark } = storeToRefs(useThemeStore())
// props
const props = defineProps<EchartsProps>()
// chartsDOM
const chartDom = ref<HTMLDivElement | null>(null)
// charts实例
let myChart: EChartsType | null = null

// 重新渲染图表
const onHandleReset = () => {
    if (chartDom.value && myChart) {
        myChart.dispose()
        myChart = init(chartDom.value as HTMLDivElement, isDark.value ? 'dark' : undefined);
        props.option && myChart.setOption(props.option);
    }
}

onMounted(() => {
    if (chartDom.value) {
        // 渲染图表
        myChart = init(chartDom.value, isDark.value ? 'dark' : undefined);
        props.option && myChart.setOption(props.option);
        // 主题更新了 重新渲染图表
        watch(isDark, onHandleReset)
        // 高宽更新重新渲染图表
        watch(() => [ props.height, props.width ], () => {
            nextTick(() => {
                // 父组件初始化渲染时 需要使用nextTick
                onHandleReset()
            })
        })
    }
})

defineExpose({
    onHandleReset
})

defineOptions({
    name: 'Echarts'
})
</script>

<style scoped lang="scss"> 
.echart-container {
     display: flex;
     align-items: center;
 }
</style>
