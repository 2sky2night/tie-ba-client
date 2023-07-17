<template>
  <div class="page-container">
    <div class="main-content">
      <Logo />
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
          <n-form-item :show-require-mark="false" path="username" label="用户名">
            <n-input v-model:value="userData.username" placeholder="请输入用户名" />
          </n-form-item>
          <n-form-item :show-require-mark="false" path="password" label="密码">
            <n-input show-password-on='click' type="password" placeholder="请输入密码" v-model:value="userData.password" />
          </n-form-item>
          <n-form-item :show-require-mark="false" path="rePassword" label="确认密码">
            <n-input show-password-on='click' type="password" placeholder="请再次输入密码" v-model:value="userData.rePassword" />
          </n-form-item>
        </n-form>
        <div class="btns mt-10">
          <n-button class="mr-10" style="width: 50%;" @click="onHandleReset">重置</n-button>
          <n-button type="primary" style="width: 50%;" @click="onHandleSubmit">注册</n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
// hooks
import { reactive, ref, watch } from 'vue'
import { useMessage } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
// types
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
// components
import Logo from '@/components/common/Logo/index.vue'
// apis
import { registerAPI } from '@/apis/register'
// configs
import tips from '@/config/tips'

// 消息组件
const message = useMessage()
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
  rePassword: ''
})
// 表单验证规则
const rules: FormRules = {
  username: {
    required: true,
    validator (_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error(tips.formNotEmpty('用户名'))
        // 用户名必须为1-15个字节
      } else if (value.length > 15) {
        return new Error(tips.textNameAllSize('用户名', 15, 1))
      }
      return true
    },
    trigger: [ 'input', 'blur' ]
  },
  password: {
    required: true,
    validator (_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error(tips.formNotEmpty('密码'))
      } else if (value.length < 6 || value.length > 14) {
        return new Error(tips.textNameAllSize('密码', 14, 6))
      } else if (value !== userData.rePassword && userData.rePassword.length) {
        return new Error(tips.passwordNotEqual)
      }
      return true
    },
    trigger: [ 'input', 'blur' ]
  },
  rePassword: {
    required: true,
    validator (_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error(tips.formNotEmpty('密码'))
      } else if (value.length < 6 || value.length > 14) {
        return new Error(tips.textNameAllSize('密码', 14, 6))
      } else if (value !== userData.password) {
        return new Error(tips.passwordNotEqual)
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
  userData.rePassword = ''
  if (formRef.value) {
    //重置错误信息
    formRef.value.restoreValidation()
  }
}

/**
 * 点击注册的回调
 */
const onHandleSubmit = async () => {
  try {
    if (formRef.value) {
      await formRef.value.validate()
      await registerAPI(userData)
      // 注册成功 进入登录页
      router.push('/login')
      message.success('注册成功!')
    }
  } catch (error) {
    console.log(error)
  }
}

// 动态监听录入的值是否满足要求,满足验证条件就清除错误信息
watch(userData, () => {
  if (formRef.value) {
    if (userData.username && userData.password === userData.rePassword && userData.password.length >= 6 && userData.password.length <= 14 && userData.rePassword.length >= 6 && userData.rePassword.length <= 14) {
      formRef.value.restoreValidation()
    }
  }
})

// 清除用户输入的左右空串
watch(() => userData.username, () => {
  userData.username = userData.username.trim()
})

defineOptions({
  name: 'Register'
})
</script>

<style scoped lang='scss'>
.page-container {
  padding: 8vh 20px;

  display: flex;
  justify-content: center;

  .main-content {
    max-width: 650px;
    width: 80%;
    margin: 0 auto;

    .form-container {
      .btns {
        display: flex;
        justify-content: center;
      }
    }

  }
}

@media screen and (max-width:650px) {
  .page-container {
    .main-content {
      width: 100%;
    }
  }
}
</style>