<template>
  <div class="edit-password-container">
    <n-form :show-require-mark="false" ref="formIns" :model="formModel" :rules="rules">
      <n-form-item path="oldPassword" label="旧密码">
        <n-input size="large" showPasswordOn="click" type="password" :placeholder="tips.formPlaceholder('旧密码')"
          v-model:value="formModel.oldPassword"></n-input>
      </n-form-item>
      <n-form-item path="password" label="新密码">
        <n-input size="large" showPasswordOn="click" type="password" :placeholder="tips.formPlaceholder('密码')"
          v-model:value="formModel.password"></n-input>
      </n-form-item>
      <n-form-item path="rePassword" label="再次输入新密码">
        <n-input size="large" showPasswordOn="click" type="password" :placeholder="tips.formPlaceholder('密码')"
          v-model:value="formModel.rePassword"></n-input>
      </n-form-item>
      <n-form-item>
        <div class="btns">
          <n-button :loading="isLoading" @click="onHandleReset">重置</n-button>
          <n-button :loading="isLoading" class="ml-10" type="primary" @click="onHandleSubmit">确认</n-button>
        </div>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang='ts' setup>
// hooks
import useUserStore from '@/store/user';
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
// configs
import tips from '@/config/tips';
// types
import type { FormInst, FormRules } from 'naive-ui';

// 正在加载
const isLoading = ref(false)
// 用户仓库
const userStore = useUserStore()
// 表单数据
const formModel = ref({
  password: '',
  rePassword: '',
  oldPassword: ''
})
// 表单实例
const formIns = ref<FormInst | null>(null)
// message组件api
const message = useMessage()

// 密码校验的回调
const onHandlePasswordCheck = (_: any, value: string) => {
  if (value.length === 0) {
    return new Error(tips.formPlaceholder('密码'))
  } else if (value.length >= 6 && value.length <= 14) {
    return true
  } else {
    return new Error(tips.textNameAllSize('密码', 14, 6))
  }
}
// 表单规则
const rules: FormRules = {
  oldPassword: {
    required: true,
    validator: onHandlePasswordCheck,
    trigger: [ 'input', 'blur' ]
  },
  password: {
    required: true,
    validator: onHandlePasswordCheck,
    trigger: [ 'input', 'blur' ]
  },
  rePassword: {
    required: true,
    validator: (_, value: string) => {
      if (value.length === 0) {
        // 空串
        return new Error(tips.formPlaceholder('密码'))
      } else if (value.length >= 6 && value.length <= 14) {
        // 密码长度合理
        if (value === formModel.value.password) {
          // 两次密码是否一致
          return true
        } else {
          return new Error(tips.passwordNotEqual)
        }
      } else {
        // 密码范围非法
        return new Error(tips.textNameAllSize('密码', 14, 6))
      }
    },
    trigger: [ 'input', 'blur' ]
  }
}
// 重置表单
const onHandleReset = () => {
  formModel.value.oldPassword = ''
  formModel.value.password = ''
  formModel.value.rePassword = '';
}
// 提交
const onHandleSubmit = async () => {
  try {
    isLoading.value = true
    await userStore.toEditUserPassword({ password: formModel.value.password, oldPassword: formModel.value.oldPassword })
    message.success(tips.successEditPassword)
  } catch (error) {
    onHandleReset()
  } finally {
    isLoading.value = false
  }
}


</script>

<style scoped lang='scss'>
.edit-password-container {
  .btns {
    width: 100%;
    display: flex;
    justify-content: end;
  }
}
</style>