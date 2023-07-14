<template>
  <div class="upload-img-container">
    <div class="list">
      <div class="item" v-for="(item,index) in fileList" :key="index" @click="() => onHandleUpload(index)">
        <div class="photo-container" v-if="photo[ index ]">
          <img :src="photo[ index ]">
          <div class="delete-container" @click.stop="() => onHandleDelete(index)">
            <n-icon>
              <DeleteOutlined />
            </n-icon>
          </div>
        </div>
        <div class="empty-container" v-else>
          <span>{{ tips.pleaseSelectImage }}</span>
        </div>
      </div>
    </div>
    <input type="file" ref="fileDOM">
  </div>
</template>

<script lang='ts' setup>
// apis
import { uploadImgAPI } from '@/apis/public/file'
// hooks
import { reactive, ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui';
// config
import tips from '@/config/tips';
// components
import { DeleteOutlined } from '@vicons/antd'

// props
const props = defineProps<{
  photo: (string | undefined)[]
}>()
// 文件列表
const fileList = reactive<(File | null)[]>([ null, null, null ])
// 文件域DOM
const fileDOM = ref<HTMLInputElement | null>(null)
// message的api
const message = useMessage()
// 当前点击的配图容器
let uploadIndex = 0

// 点击配图容器的回调
const onHandleUpload = (index: number) => {
  if (index !== 0) {
    // 用户必须依次上传图片
    if (fileList[ index-1 ] === null) {
      return message.warning(tips.pleaseUploadInTurn)
    }
  }
  fileDOM.value?.click()
  // 记录当前上传图片的是那个索引
  uploadIndex = index
}
// 删除图片的回调
const onHandleDelete = (index: number) => {
  // 重置对应图片为null
  props.photo[ index ] = undefined
  fileList[ index ] = null
}
// 重置上传的图片内容的回调
const onHandleReset = () => {
  props.photo.forEach((_,index,arr) => {
    arr[index]=undefined
  })
  fileList.forEach((_, index, arr) => {
    arr[index]=null
  })
}

onMounted(() => {
  const fileInput = fileDOM.value as HTMLInputElement
  fileInput.addEventListener('change', async () => {
    if (fileInput.files?.length) {
      // 选择了文件就立即上传
      const formData = new FormData()
      formData.append('image', fileInput.files[ 0 ])
      const res = await uploadImgAPI(formData)
      // 通过索引保存图片url
      props.photo[ uploadIndex ] = res.data
      fileList[ uploadIndex ] = fileInput.files[ 0 ]
      message.success(tips.successUpload)
    }
  })

})

defineExpose({
  onHandleReset
})
</script>

<style scoped lang='scss'>
.upload-img-container {
  width: 100%;

  .list {
    display: flex;

    .item {
      cursor: pointer;
      border: 1px solid var(--border-color-1);

      &:not(:last-child) {
        margin-right: 10px;
      }

      height: 30vw;
      width: 30vw;
      max-width: 400px;
      max-height: 400px;

      .photo-container {
        height: 100%;
        display: flex;
        position: relative;

        .delete-container{
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-mask);
          transition: all var(--time-normal);
          opacity: 0;
          i{
            font-size: 30px;
            color:var(--text-color-1);
          }
          &:hover{
            opacity: 1;
          }
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .empty-container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  input[type=file] {
    display: none;
  }
}</style>