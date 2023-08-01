<template>
  <div class="edit-container">
    <div class="tools">
      <div class="switch">
        <span class="sub-text mr-5">开启Markdown预览</span>
        <n-switch v-model:value="preview" size="small" @update:value="onHandleTogglePre"></n-switch>
      </div>
    </div>
    <MdEditor ref="MdEditorIns"  :preview="preview" :toolbars="[]" :class="isDark ? 'dark' : ''" :theme="isDark ? 'dark' : 'light'" :model-value="value"
      @update:model-value="onHandleInput"></MdEditor>
  </div>
</template>

<script lang='ts' setup>
// components
import { MdEditor } from 'md-editor-v3'
// style
import 'md-editor-v3/lib/style.css';
// hooks
import useThemeStore from '@/store/theme';
import { storeToRefs } from 'pinia';
import { ref,onMounted } from 'vue'

// theme
const { isDark } = storeToRefs(useThemeStore())
// md实例
const MdEditorIns=ref()
// props
defineProps<{ value: string }>()
// emits
const emits = defineEmits<{ 'update:value': [ value: string ] }>()
// 是否显示md预览
const preview = ref(false)

// 文本更新的回调
const onHandleInput = (value: string) => emits('update:value', value)

// 切换预览的回调
const onHandleTogglePre = () => {
  MdEditorIns.value&&MdEditorIns.value.togglePreview()
}

onMounted(() => {
  console.log(MdEditorIns.value);
})

</script>

<style scoped lang='scss'>
.dark {
  background-color: var(--bg-color-2);
}

.edit-container {
  .tools {
    height: 30px;
    background-color: var(--bg-color-7);
    border: 1px solid var(--border-color-1);
    border-bottom: none;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 10px;
    .switch{
      display: flex;
    }
  }
}
</style>