<template>
  <MdPreview :class="isDark?'dark':''" :model-value="value" :theme="isDark ? 'dark' : 'light'" />
</template>

<script lang='ts' setup>
// components
import { MdPreview } from 'md-editor-v3'
// style
import 'md-editor-v3/lib/style.css';
// hooks
import useThemeStore from '@/store/theme';
import { storeToRefs } from 'pinia';

// theme
const { isDark } = storeToRefs(useThemeStore())
// props
defineProps<{ value: string }>()

defineOptions({
  name: 'MdPre'
})
</script>

<style scoped lang='scss'>
.dark{
  background-color: var(--bg-color-2);
}
</style>