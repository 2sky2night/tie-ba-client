<template>
  <div class="page-container">
    <div class="page-title mb-10">创建吧</div>
    <n-form ref="formIns" :model="model" :rules="rules" :show-require-mark="false">
      <n-form-item label="吧名" path="bname">
        <n-input size="large" maxlength="15" show-count v-model:value="model.bname"
          :placeholder="tips.formPlaceholder('吧的名称')"></n-input>
      </n-form-item>
      <n-form-item label="吧简介" path="bdesc">
        <n-input size="large" type="textarea" maxlength="120" show-count v-model:value="model.bdesc"
          :placeholder="tips.formPlaceholder('吧的简介')"></n-input>
      </n-form-item>
      <n-form-item label="吧头像" path="photo">
        <div class="upload-container">
          <n-button type="primary" @click="onHandleShowUpload">上传头像</n-button>
          <div class="pre-imgs mt-10" v-if="model.photo">
            <div class="item large mr-10">
              <img :src="model.photo">
            </div>
            <div class="item middle mr-10">
              <img :src="model.photo">
            </div>
            <div class="item small">
              <img :src="model.photo">
            </div>
          </div>
        </div>
      </n-form-item>
      <n-form-item>
        <div class="btns">
          <n-button :loading="isLoading" @click="onHandleReset" class="mr-10">重置</n-button>
          <n-button :loading="isLoading" @click="onHandleSubmit" type="primary">确认</n-button>
        </div>
      </n-form-item>
    </n-form>
    <ImgCutterModal @update:imgUrl="onHandleCutDown" v-model:imgUrl="imgUrl" v-model:isShowModal="isShowModal" />
  </div>
</template>

<script lang='ts' setup>
// apis
import { createBarAPI } from '@/apis/create-bar'
// types
import type { FormRules, FormInst } from 'naive-ui'
// hooks
import { reactive, ref, watch } from 'vue'
import { useMessage } from 'naive-ui';
import useNavigation from '@/hooks/useNavigation';
// config
import tips from '@/config/tips';
// components
import ImgCutterModal from '@/components/common/ImgCutterModal/index.vue'

// 导航
const { goHome } = useNavigation()
// 表单实例
const formIns = ref<FormInst | null>(null)
// 表单数据
const model = reactive<{ photo: null | string; bname: string; bdesc: string }>({
  photo: null,
  bname: '',
  bdesc: ''
})
// 上传的图片url
let imgUrl = ref('')
// message
const message = useMessage()
// 是否显示上传图片的模态框
const isShowModal = ref(false)
// 表单验证的规则
const rules: FormRules = {
  photo: {
    required: true,
    validator (_, value: string | null) {
      if (value === null) {
        return new Error(tips.pleaseSelectFile)
      } else {
        return true
      }
    }
  },
  bname: {
    required: true,
    trigger: [ 'blur', 'input' ],
    validator (_, value: string) {
      if (value.length) {
        return true
      } else {
        return new Error(tips.textNameNotEmpty('吧的名称'))
      }
    }
  },
  bdesc: {
    required: true,
    trigger: [ 'blur', 'input' ],
    validator (_, value: string) {
      if (value.length) {
        return true
      } else {
        return new Error(tips.textNameNotEmpty('吧的简介'))
      }
    }
  }
}
let isLoading = ref(false)

// 点击上传头像的回调 显示模态框
const onHandleShowUpload = () => {
  isShowModal.value = true
}
// 裁剪图片成功的回调
const onHandleCutDown = (value: string) => {
  model.photo = value
}
// 点击重置的回调
const onHandleReset = () => {
  model.photo = null
  model.bname = ''
  model.bdesc = ''
  imgUrl.value = '';
  (formIns.value as FormInst).restoreValidation()
}

// 点击创建吧的回调
const onHandleSubmit = async () => {
  await (formIns.value as FormInst).validate()
  try {
    isLoading.value = true
    await createBarAPI({
      bdesc: model.bdesc,
      bname: model.bname,
      photo: model.photo as string
    })
    message.success(tips.successCreateBar)
    goHome()
  } catch {
    onHandleReset()
  } finally {
    isLoading.value = false
  }
}


watch(() => [ model.bname, model.bdesc ], () => {
  model.bdesc = model.bdesc.trim()
  model.bname = model.bname.trim()
})

defineOptions({
  name: 'CreateBar'
})
</script>

<style scoped lang='scss'>
.page-container {
  .btns {
    width: 100%;
    display: flex;
    justify-content: end;
  }

  .upload-container {
    .pre-imgs {
      display: flex;

      .item {
        align-self: end;

        img {
          width: 100%;
          height: 100%;
        }

        &.large {
          width: 50%;
          height: 50%;
        }

        &.middle {
          width: 35%;
          height: 35%;
        }

        &.small {
          width: 20%;
          height: 20%;
        }
      }
    }
  }
}
</style>