<template>
  <n-modal @update:show="onHandleModalShow" style="width: 80%;" :show="modelValue" preset="card" title="添加评论配图">
    <div>
      <n-upload @before-upload="onHandleBefore" @finish="onHandleChangeList" :action="`${ baseURL }/file/image`" name="image" :default-file-list="fileList" list-type="image-card" :headers="{authorization:`Bearer ${userStore.token}`}">
        点击上传
      </n-upload>
    </div>
    <template #action>
      <div>操作</div>
    </template>
  </n-modal>
</template>

<script lang='ts' setup>
import { reactive } from 'vue'
import { useMessage } from 'naive-ui';
import useUserStore from '@/store/user';
import type { UploadFileInfo } from 'naive-ui'
import tips from '@/config/tips';

const baseURL = import.meta.env.VITE_BASE_URL
const fileList = reactive<UploadFileInfo[]>([])
const userStore = useUserStore()
const message=useMessage()
// props
const props = defineProps<{
  photo: string[]
  modelValue: boolean;
}>()
// emit
const emit = defineEmits<{
  'update:modelValue': [ value: boolean ]
}>()

// 关闭模态框的回调
const onHandleModalShow = (value: boolean) => {
  emit('update:modelValue', value)
}
// 上传文件之前的拦截器
const onHandleBefore = (options:{file:UploadFileInfo })=>{
  if (options.file.type?.includes('image')) {
    if (options.file.file) {      
      // 是图片格式(size=字节单位)
      if (options.file.file.size <= 10 * 1024 * 1024) {
        // 图片大小小于10MB
        return true
      } else {
        // 大小超过限制
        message.warning(tips.imageSizeOverflow)
        return false
      }
    }
    message.warning(tips.pleaseSelectFile)
    return false
  } else {
    // 非图片格式
    message.warning(tips.allowImage)
    return false
  }
}
// 上传的图片列表长度发生变化的回调
const onHandleChangeList = (options: { event: ProgressEvent }) => {
  // @ts-ignore
  const res = JSON.parse(options.event.currentTarget.response)
  props.photo.push(res.data)
}

</script>