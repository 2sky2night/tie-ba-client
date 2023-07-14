<template>
  <n-modal :show="isShowModal">
    <div class="modal-container">
      <div class="page-title mb-10">裁剪图片</div>
      <ImgCutter ref="imgCutter" :isModal="false" :boxWidth="imgCutterWidth" @cutDown="onHandleCutDown">
        <template #choose>
          <n-button :loading="isLoading">选择图片</n-button>
        </template>
        <template #cancel>
          <n-button :loading="isLoading" class="ml-10" @click="onHandleClose">取消</n-button>
        </template>
        <template #confirm>
          <n-button :loading="isLoading" class="ml-10" type="primary">确认</n-button>
        </template>
      </ImgCutter>
    </div>
  </n-modal>
</template>

<script lang='ts' setup>
// apis
import { uploadImgAPI } from '@/apis/public/file';
// hooks
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useMessage } from 'naive-ui';
// components
import ImgCutter from 'vue-img-cutter'
// configs
import tips from '@/config/tips';

// 加载中
const isLoading = ref(false)
// 图片裁剪组件实例
const imgCutter = ref()
// props
const props = defineProps<{
  imgUrl: string;
  isShowModal: boolean
}>()
// message 的 api
const message = useMessage()
// emit
const emit = defineEmits<{
  'update:isShowModal': [ value: boolean ];
  'update:imgUrl': [ value: string ]
}>()
// 图片裁剪组件的宽度
const imgCutterWidth = ref<320 | 600>(320)

// 点击取消的回调
const onHandleClose = () => {
  emit('update:isShowModal', false)
}

// 裁剪好图片的回调
const onHandleCutDown = async (value: { blob: Blob, file: File }) => {
  try {
    if (value.blob.size > 1024 * 1024 * 10) {
      return message.warning(tips.imageSizeOverflow)
    }
    isLoading.value = true
    const formData = new FormData()
    formData.append('image', value.file)
    const res = await uploadImgAPI(formData)
    emit('update:imgUrl', res.data)
    // 关闭模态框
    onHandleClose()
    message.success(tips.successUpload)

  } finally {
    isLoading.value = false
  }

}


// 组件渲染时通过视口宽度调整模态框宽度
onMounted(() => {
  function checkImgCutterWidth () {
    if (window.innerWidth > 650) {
      imgCutterWidth.value = 600
    } else {
      imgCutterWidth.value = 320
    }
  }
  // 调整裁剪组件宽度
  checkImgCutterWidth()
  // 开启窗口大小监听 调整裁剪组件宽度
  window.addEventListener('resize', checkImgCutterWidth)
  // 卸载组件时取消监听
  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkImgCutterWidth)
  })
})

defineOptions({
  name: 'ImgCutterModal'
})
</script>

<style scoped lang='scss'>
.modal-container {
  padding: 15px 20px;
  background-color: var(--bg-color-1);
}

// 图片裁剪组件的样式
.img-cutter {
  padding: 10px 20px;
  background-color: var(--bg-color-1);
  border-radius: 5px;

  .title {
    font-size: 20px;
  }
}

:deep(.vue-img-cutter) {
  overflow: hidden;
}

:deep(.i-dialog-footer) {
  background-color: var(--bg-color-1);
  margin: 0;
  height: 50px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;

  input[type=file] {
    display: none;
  }
}

:deep(.dialogBox) {
  background-color: var(--bg-color-1);
}

// 图片裁剪
:deep(.toolBox) {
  background-color: var(--bg-color-1);
  border: none !important;

  .btn-warning {
    display: none;
  }

  .copyright {
    display: none !important;
  }
}
</style>