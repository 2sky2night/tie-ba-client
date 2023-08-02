<template>
  <div class="page-container">
    <div class="page-title mb-10">发帖</div>
    <div class="post-aritcle-form">
      <n-form ref="formIns" :model="model" :rules="rules">
        <n-form-item label="标题" path="title">
          <n-input v-model:value="model.title" show-count maxlength="30"
            :placeholder="tips.formPlaceholder('帖子标题')"></n-input>
        </n-form-item>
        <n-form-item label="内容" path="content">
          <MdEdit style="width: 100%;" v-model:value="model.content"></MdEdit>
        </n-form-item>
        <n-form-item label="配图" path="photo">
          <UploadImg ref="uploadIns" v-model:photo="model.photo" />
        </n-form-item>
        <n-form-item label="发送到" path="bid">
          <BarSelect ref="barSelectIns" v-model:select="model.bid" />
        </n-form-item>
        <n-form-item>
          <div class="btns">
            <n-button :loading="isLoading" class="mr-10" @click="onHandleReset">重置</n-button>
            <n-button :loading="isLoading" type="primary" @click="onHandleSubmit">确认</n-button>
          </div>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<script lang='ts' setup>
// types
import type { FormRules, FormInst } from 'naive-ui';
// hooks
import { reactive, ref } from 'vue'
import useNavigation from '@/hooks/useNavigation';
import { useMessage } from 'naive-ui';
import { onBeforeRouteLeave } from 'vue-router'
// apis
import { postArticleAPI } from '@/apis/post-article';
// configs
import tips from '@/config/tips';
// components
import BarSelect from './components/BarSelect.vue'
import UploadImg from './components/UploadImg.vue';
import MdEdit from '@/components/common/MdEdit/index.vue'
import asyncDialog from '@/render/modal/dialog';

// 表单实例
const formIns = ref<FormInst | null>(null)
// 上传图片组件的实例
const uploadIns = ref()
// 吧选择器组件的实例
const barSelectIns = ref()
// message
const message = useMessage()
// 导航
const { goHome } = useNavigation()
// 发帖表单
const model = reactive<{
  bid: null | number;
  content: '';
  title: '';
  photo: (undefined | string)[];
}>({
  bid: null,
  content: '',
  title: '',
  photo: [ undefined, undefined, undefined ]
})
// 表单验证规则
const rules: FormRules = {
  title: {
    trigger: [ 'input', 'blur' ],
    required: true,
    validator (_, value: string) {
      if (value.trim()) {
        return true
      } else {
        return new Error(tips.textNameNotEmpty('帖子标题'))
      }
    }
  },
  content: {
    trigger: [ 'input', 'blur' ],
    required: true,
    validator (_, value: string) {
      if (value.trim()) {
        if (value.trim().length > 9999) {
          return new Error(tips.textAllowSize(9999))
        }
        return true
      } else {
        return new Error(tips.textNameNotEmpty('帖子内容'))
      }
    }
  },
  photo: {
    required: false
  },
  bid: {
    required: true,
    validator (_, value: number | null) {
      if (value === null) {
        return new Error(tips.pleaseSelectBar)
      } else {
        return true
      }
    }
  }
}
// 正在加载
const isLoading = ref(false)

// 重置表单
const onHandleReset = () => {
  model.content = ''
  model.title = ''
  // 重置选择的吧
  barSelectIns.value.onHandleReset()
  // 重置上传的图片
  uploadIns.value.onHandleReset();
  // 重置表单验证的错误
  (formIns.value as FormInst).restoreValidation()
}

// 提交表单的回调
const onHandleSubmit = async () => {
  // 表单校验
  await (formIns.value as FormInst).validate();
  try {
    isLoading.value = true
    await postArticleAPI({
      bid: model.bid as number,
      content: model.content,
      title: model.title,
      photo: model.photo.every(ele => ele === undefined) ? null : model.photo.filter(ele => ele) as string[]
    })
    message.success(tips.successPostArticle)
    goHome()
  } catch {
    isLoading.value = false
  }

}

// // 离开页面时的提示
// onBeforeRouteLeave(async(_to,_from,next) => {
//   try {
//     await asyncDialog('提示', '是否离开该页面? (注意:所填写的内容不会被保存!)')
//     next()
//   } catch (error) {
//     next(false)
//   }
// })

defineOptions({
  name: 'PostArticle'
})
</script>

<style scoped lang='scss'>
.page-container {
  .post-aritcle-form {
    .btns {
      width: 100%;
      display: flex;
      justify-content: center;

      >button {
        width: 50%;
      }
    }
  }
}

@media screen and (min-width: 651px) {
  .page-container {
    .post-aritcle-form {
      .btns {
        width: 100%;
        display: flex;
        justify-content: end;

        >button {
          width: 100px;
        }
      }
    }
  }
}
</style>