<template>
  <div class="edit-info-container">
    <n-form :show-require-mark="false" ref="formIns" :model="infoData" :rules="rules">
      <n-form-item :size="isMobile?'medium':'large'" path="avatar" label="头像">
        <div class="img-list">
          <div class="item large" @click="onHandleShowModal">
            <img :src="infoData.avatar">
          </div>
          <div class="item middel" @click="onHandleShowModal">
            <img :src="infoData.avatar">
          </div>
          <div class="item small" @click="onHandleShowModal">
            <img :src="infoData.avatar">
          </div>
        </div>
      </n-form-item>
      <n-form-item :size="isMobile?'medium':'large'" path="username" label="用户名">
        <n-input :placeholder="tips.formPlaceholder('用户名')" v-model:value="infoData.username" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item :size="isMobile?'medium':'large'" label="简介">
        <n-input :placeholder="tips.formPlaceholder('简介')" v-model:value="infoData.udesc" type="textarea" @keydown.enter.prevent />
      </n-form-item>
    </n-form>
    <n-form-item :size="isMobile?'medium':'large'">
      <div class="btns">
        <n-button :loading="isLoading" attr-type="button" @click="onHandleResetForm">
          重置
        </n-button>
        <n-button @click="onHandleSubmit" :loading="isLoading" class="ml-10" type="primary" attr-type="button">
          确定
        </n-button>
      </div>
    </n-form-item>
  </div>
  <!--上传文件的模态框-->
  <n-modal v-model:show="showModal">
    <div class="img-cutter">
      <div class="title mb-5">上传图片</div>
      <ImgCutter :isModal="false" :boxWidth="imgCutterWidth" @cutDown="onHandleCutDown">
        <template #open></template>
        <template #choose>
          <n-button>选择图片</n-button>
        </template>
        <template #cancel>
          <n-button class="ml-10" @click="onHandleCancel">取消</n-button>
        </template>
        <template #confirm>
          <n-button class="ml-10" type="primary">确认</n-button>
        </template>
      </ImgCutter>
    </div>
  </n-modal>
</template>

<script lang='ts' setup>
// types 
import type { EditUserInfoBody } from '@/apis/edit/types';
import type { FormInst, FormRules } from 'naive-ui';
// hooks
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useMessage } from 'naive-ui';
import useUserStore from '@/store/user';
// components
import ImgCutter from 'vue-img-cutter';
// apis
import { uploadImgAPI } from '@/apis/public/file'
// config
import tips from '@/config/tips';

const props = defineProps < {
  isMobile:boolean
}>()
// 表单实例
const formIns = ref<FormInst | null>(null)
// 用户选择的图片
const uploadImg = new FormData()
// 用户仓库
const userStore = useUserStore()
// 编辑的用户信息
const infoData = ref<EditUserInfoBody>({
  username: userStore.userData.username,
  avatar: userStore.userData.avatar,
  udesc:userStore.userData.udesc,
})
// 图片裁剪组件的宽度
const imgCutterWidth = ref<320 | 500>(320)
// 是否显示图片裁剪组件
const showModal = ref(false)
// message组件
const message = useMessage()
// 表单的规则校验
const rules: FormRules = {
  username: {
    required: true,
    validator: (_, value: string) => {
      if (!value) {
        // 为空串
        return new Error(tips.textNameNotEmpty('用户名'))
      } else if (value.length > 15) {
        return new Error(tips.textNameAllSize('用户名', 15, 1))
      }
      return true
    },
    trigger: [ 'input', 'blur' ]
  }
}
// 正在加载?
const isLoading = ref(false)

// 裁剪好图片的回调
const onHandleCutDown = async (target: { blob: Blob, file: File }) => {
  if (target.blob.size <= 10 * 1024 * 1024) {
    if (uploadImg.has('image')) {
      // 后续添加
      uploadImg.set('image', target.file)
    } else {
      // 初次添加
      uploadImg.append('image', target.file)
    }
    // 发送请求上传图片
    const res = await uploadImgAPI(uploadImg)
    // 将用户头像赋值为上传的头像
    infoData.value.avatar = res.data
    // 隐藏上传模态框
    showModal.value = false
    message.success(tips.successUpload)

    // for (let [key,value] of uploadImg.entries()) {
    //   console.log(key,value); 
    // }
  } else {
    message.warning(tips.imageSizeOverflow)
  }
}
// 点击头像弹出图片裁剪组件
const onHandleShowModal = () => {
  showModal.value = true
}
// 销毁图片裁剪模态框
const onHandleCancel = () => {
  showModal.value = false
}
// 重置
const onHandleResetForm = () => {
  infoData.value.avatar = userStore.userData.avatar
  infoData.value.username = userStore.userData.username;
}
// 点击确认编辑用户信息的回调
const onHandleSubmit = async () => {
  try {
    await formIns.value?.validate()
    isLoading.value = true
    await userStore.toEditUserInfo(infoData.value)
    message.success(tips.successEditUserInfo)
  } catch {
    //出错就重置信息 
    onHandleResetForm()
  } finally {
    isLoading.value = false
  }
}

// 监听用户名 禁止用户在前后输入空格
watch(() => infoData.value.username, (v) => {
  infoData.value.username = v.trim()
})

// 组件渲染时通过视口宽度调整模态框宽度
onMounted(() => {
  function checkImgCutterWidth () {
    if (window.innerWidth > 650) {
      imgCutterWidth.value = 500
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

</script>

<style scoped lang='scss'>
.edit-info-container {
  .btns {
    width: 100%;
    display: flex;
    justify-content: end;
  }

  .img-list {
    box-sizing: border-box;
    padding: 0 20px;
    width: 100%;
    display: flex;

    .item {
      border-radius: 50%;
      align-self: end;
      border: 1px solid var(--border-color-1);
      overflow: hidden;

      img {
        cursor: pointer;
        object-fit: contain;
      }

      &:not(:last-child) {
        margin-right: 20px;
      }

      &.large {
        img {
          width: 180px;
          height: 180px;
        }
      }

      &.middel {
        img {
          width: 80px;
          height: 80px;
        }
      }

      &.small {
        img {

          width: 30px;
          height: 30px;
        }
      }
    }
  }
}

@media screen and (max-width: 650px) {
  .edit-info-container {
    .img-list {
      .item {
        border-radius: 50%;
        align-self: end;

        img {
          object-fit: contain;
        }

        &:not(:last-child) {
          margin-right: 20px;
        }

        &.large {
          img {
            width: 100px;
            height: 100px;
          }
        }

        &.middel {
          img {
            width: 50px;
            height: 50px;
          }
        }

        &.small {
          img {

            width: 30px;
            height: 30px;
          }
        }
      }
    }
  }
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