<template>
  <div class="ranking-distribution">
    <div class="title">等级人数分布图</div>
    <div class="container" ref="containerDOM">
      <span class="sub-text">总人数:{{ list.reduce((pre,ele)=>pre+ele.value,0) }}人</span>
      <div class="switch">
        <span class="mr-5">全部</span>
        <n-switch @update:value="onHandleChange"></n-switch>
      </div>
      <Echart ref="chartsIns" :option="option" :width="clientXY.width" :height="clientXY.height" />
    </div>
  </div>
</template>

<script lang='ts' setup>
// apis
import { getBarRankDisAPI } from '@/apis/bar'
// hooks
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
// types
import type { EChartsOption } from 'echarts';
// components
import Echart from '@/components/common/Echarts/index.vue'

// props
const props = defineProps<{ bid: number }>()
// 数据项
const list = (await getBarRankDisAPI(props.bid)).data.list.map(ele => {
  return {
    value: ele.count,
    name: `LV:${ ele.level } ${ ele.label }`,
    selected: ele.current_uid_in
  }
})
// 配置项
const option: EChartsOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    show: false,
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      selectedMode: 'single',
      type: 'pie',
      radius: [ '40%', '70%' ],
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 0
      },
      select: {
        label: {
          show: true,
          formatter (params) {
            const data: any = params.data
            if (data.selected) {
              return '我在这儿'
            } else {
              return data.name
            }
          },
          fontSize: 15,
          fontWeight: 'bold'
        }
      },
      data: list.filter(ele => ele.value)
    }
  ]
};
// 图表容器
const containerDOM = ref<HTMLDivElement | null>(null)
// 图表容器高宽
const clientXY = reactive({ width: 300, height: 450 })
// charts组件实例
const chartsIns = ref()

// 是否查看全部
const onHandleChange = (value: boolean) => {
  if (value) {
    // 显示0人数的分区
    // @ts-ignore
    option.series[ 0 ].data = list
  } else {
    // 不显示0人数的分区
    // @ts-ignore
    option.series[ 0 ].data = list.filter(ele => ele.value)
  }
  chartsIns.value.onHandleReset()
}

onMounted(() => {
  // 初始化时设置图表宽度
  clientXY.width = (containerDOM.value as HTMLDivElement).clientWidth
  const observer = new ResizeObserver((e) => {
    // 尺寸发生变化时的回调
    if (e.length)
      clientXY.width = e[ 0 ].contentRect.width
  })
  // 监听那个DOM元素
  observer.observe((containerDOM.value as HTMLDivElement))
  // 组件被销毁时 取消监听
  onBeforeUnmount(() => {
    observer.unobserve((containerDOM.value as HTMLDivElement))
  })
})


</script>

<style scoped lang='scss'>
.ranking-distribution {
  .title {
    font-weight: 600;
    font-size: 20px;
    color: var(--primary-color);
    transition: var(--time-normal);
  }

  .container {
    position: relative;
    >span{
      z-index: 100;
      top: 10px;
      left: 10px;
      position: absolute;
    }
    .switch {
      right: 10px;
      top: 10px;
      color: var(--text-color-2);
      font-size: 12px;
      z-index: 100;
      position: absolute;
      span{
        position: relative;
        top:3px;
      }
    }
  }
}

@media screen and (max-width:650px) {
  .ranking-distribution {
    .title {
      font-size: 16px;
    }
  }
}
</style>