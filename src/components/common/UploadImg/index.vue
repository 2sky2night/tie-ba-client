<template>
  <n-modal :mask-closable="false" :closable="false" style="width: 80%;" :show="modelValue" preset="card" title="添加评论配图">
    <template #default>
      <div class="upload">
        <n-upload :max="20" :show-remove-button="false" ref="fileIns" @before-upload="onHandleBefore" @finish="onHandleChangeList"
          :action="`${baseURL}/file/image`" name="image" :default-file-list="fileList" list-type="image-card"
          :headers="{ authorization: `Bearer ${userStore.token}` }">
          点击上传
        </n-upload>
      </div>
      <div class="btns">
        <n-button @click="onHandlCancel">取消</n-button>
        <n-button type="primary" @click="onHandleSubmit">确认</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue'
import { useMessage } from 'naive-ui';
import useUserStore from '@/store/user';
import type { UploadFileInfo, UploadInst } from 'naive-ui'
import tips from '@/config/tips';

// upload实例
const fileIns = ref<UploadInst | null>(null)
// 请求基地址
const baseURL = import.meta.env.VITE_BASE_URL
// 用户store 用户获取token
const userStore = useUserStore()
// message 的api
const message = useMessage()
// props
const props = defineProps<{
  /**
   * 收集到的图片url
   */
  photo: string[];
  /**
   * 是否显示该模态框
   */
  modelValue: boolean;
  /**
   * 默认图片文件列表
   */
  imgList: UploadFileInfo[];
}>()
// 上传的文件列表(只是为了展示数据的文件列表)
const fileList = reactive<UploadFileInfo[]>(Object.assign([], props.imgList))
// emit
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// 上传文件之前的拦截器
const onHandleBefore = (options: { file: UploadFileInfo }) => {
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

// 上传的图片列表长度发生变化的回调 将图片url收集起来
const onHandleChangeList = (options: any) => {
  // @ts-ignore 将图片urll收集起来
  const res = JSON.parse(options.event.currentTarget.response)
  props.photo.push(res.data)
  // 保存上传的文件
  props.imgList.push(options.file)
  fileList.push(options.file)
}

// 取消上传配图
const onHandlCancel = () => {
  onHandleReset()
  // 关闭模态框
  emit('update:modelValue', false)
}
// 点击确定上传配图
const onHandleSubmit = () => {
  // 销毁模态框
  emit('update:modelValue', false)
}
// 重置父组件间的图片列表i和文件列表 清空当前上传的文件列表
const onHandleReset = () => {
  // 清空 父组件的photo内容
  props.photo.length = 0
  // 清空 父组件的文件列表
  props.imgList.length = 0
  // 清空 已经上传的文件列表
  fileList.length = 0
  // 清空上传·的文件
  if (fileIns.value) {
    fileIns.value.clear()
  }
}

defineExpose({ onHandleReset })

defineOptions({
  name: 'UploadImg'
})
</script>

<style scoped lang="scss">
.btns {
  display: flex;
  justify-content: end;

  >button:first-child {
    margin-right: 10px;
  }
}

.upload {
  margin-bottom: 10px;
}
</style>