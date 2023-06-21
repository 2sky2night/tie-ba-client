<template>
  <div class="page-container">
    <div class="main-content">
      <div class="title mb-10">
        <span>标题</span>
      </div>
      <n-tabs :value="route.path" @update:value="onHandleChange" type='segment'>
        <n-tab name="/login">
          登录
        </n-tab>
        <n-tab name="/register">
          注册
        </n-tab>
      </n-tabs>
      <div class="form-container mt-10">
        <n-form ref="formRef" :model="userData" :rules="rules">
          <n-form-item path="username" label="用户名">
            <n-input v-model:value.trim="userData.username" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input type="password" show-password-on='click' v-model:value="userData.password" @keydown.enter.prevent />
          </n-form-item>
        </n-form>
        <div class="btns mt-10">
          <n-button class="mr-10" style="width: 50%;" @click="onHandleReset">重置</n-button>
          <n-button type="primary" style="width: 50%;" @click="onHandleSubmit">登录</n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
// hooks
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// types
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'

// 表单实例
const formRef = ref<FormInst | null>(null)
// 路由对象
const router = useRouter()
// 路由元数据
const route = useRoute()
// 用户数据
const userData = reactive({
  username: '',
  password: '',
})
// 表单验证规则
const rules: FormRules = {
  username: {
    required: true,
    validator (_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('用户名不能为空')
      }
      return true
    },
    trigger: [ 'input', 'blur' ]
  },
  password: {
    required: true,
    validator (_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('密码不能为空')
      } else if (value.length < 6 || value.length > 14) {
        return new Error('密码长度必须为6-14位')
      }
      return true
    },
    trigger: [ 'input', 'blur' ]
  }
}
/**
 * 面板点击的回调
 * @param value 对应path路径
 */
const onHandleChange = (value: string) => {
  router.push(value)
}

/**
 * 重置表单内容
 */
const onHandleReset = () => {
  userData.password = ''
  userData.username = ''
  if (formRef.value) {
    //重置错误信息
    formRef.value.restoreValidation()
  }
}

/**
 * 点击登录的回调
 */
const onHandleSubmit = async () => {
  try {
    if (formRef.value) {
      await formRef.value.validate()
      console.log('校验成功')
    }
  } catch (error) {

  }
}

defineOptions({
  name: 'Login'
})
</script>

<style scoped lang='scss'>
.page-container {
  padding: 0 20px;

  display: flex;
  // align-items: center;
  justify-content: center;

  .main-content {
    max-width: 650px;
    min-width: 400px;
    width: 50%;
    margin: 0 auto;

    .title {
      margin-top: 30%;
    }

    .form-container {
      .btns {
        display: flex;
        justify-content: center;
      }
    }

  }
}
</style>