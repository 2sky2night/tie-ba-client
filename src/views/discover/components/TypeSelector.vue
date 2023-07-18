<template>
  <div class="type-selector-container">
    <n-select @update:value="onHandleUpdate" :options="options" :value="value"></n-select>
    <slot></slot>
  </div>
</template>

<script lang='ts' setup>
// types
import type { HotType } from '@/apis/discover/hot-article/types';
import type { SelectOption } from 'naive-ui'

defineProps<{
  value: HotType
}>()
const emits = defineEmits<{
  'update:value': [ value: HotType ]
}>()
// 选择的配置项
const options: SelectOption[] = [
  {
    label: '最近24小时',
    value: 1
  },
  {
    label: '最近3天',
    value: 2
  },
  {
    label: '最近15天',
    value: 3
  },
  {
    label: '最近3个月',
    value: 4
  },
  {
    label: '最近1年',
    value: 5
  }
]
// 选择更新的回调
const onHandleUpdate = (value: HotType) => {
  emits('update:value', value)
}
</script>

<style scoped lang='scss'>
.type-selector-container {
  display: flex;
  align-items: center;
  justify-content: space-between;

  :deep(.n-select) {
    width: 150px;
  }
}
</style>