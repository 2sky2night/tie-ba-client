<template>
  <div class="upload-img-container">
    <div class="list">
      <template v-if="fileList.length">
        <div class="item" v-for="(item,index ) in fileList" :key="index" @click="() => onHandleUpload(index)">
        </div>
      </template>
      <template v-else>
        <div class="item" @click="() => onHandleUpload(0)"></div>
      </template>
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
import tips from '@/config/tips';


// props
const props = defineProps<{
  photo: string[] | null | string
}>()
// emits

// 文件列表
const fileList: File[] = reactive([])
// 文件域DOM
const fileDOM = ref<HTMLInputElement | null>(null)
// message的api
const message = useMessage()
// 当前点击的配图容器
let uploadIndex=0

// 点击配图容器的回调
const onHandleUpload = (index: number) => {
  fileDOM.value?.click()
  uploadIndex=index
}

onMounted(() => {
  const fileInput = fileDOM.value as HTMLInputElement
  fileInput.addEventListener('change', async() => {
    if (fileInput.files?.length) {
      // 选择了文件就立即上传
      const formData = new FormData()
      formData.append('image', fileInput.files[ 0 ])
      await uploadImgAPI(formData)
      fileList[uploadIndex]=fileInput.files[ 0 ]
      message.success(tips.successUpload)
    }
    console.log(fileInput.files);
  })

})

</script>

<style scoped lang='scss'>
.upload-img-container {
  width: 100%;

  .list {
    display: flex;

    .item {
      cursor: pointer;

      &:not(:last-child) {
        margin-right: 10px;
      }

      height: 30vw;
      width: 30vw;
      max-width: 400px;
      max-height: 400px;
      background-color: pink;
    }
  }

  input[type=file] {
    display: none;
  }
}</style>