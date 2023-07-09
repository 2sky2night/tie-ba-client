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
            <n-input v-model:value.trim="userData.username" placeholder="请输入用户名" />
          </n-form-item>
          <n-form-item :show-require-mark="false" path="password" label="密码">
            <n-input type="password" show-password-on='click' placeholder="请输入密码" v-model:value="userData.password" />
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
import useUserStore from '@/store/user'
import { useMessage } from 'naive-ui'
// types
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
// components
import Logo from '@/components/common/Logo/index.vue'

// 用户仓库
const userStore = useUserStore()
// 表单实例
const formRef = ref<FormInst | null>(null)
// 路由对象
const router = useRouter()
// 路由元数据
const route = useRoute()
// 用户数据
const userData = reactive({
  username: 'admin',
  password: '123456'
})
// 表单验证规则
const rules: FormRules = {
  username: {
    required: true,
    validator(_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('用户名不能为空')
      }
      return true
    },
    trigger: ['input', 'blur']
  },
  password: {
    required: true,
    validator(_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('密码不能为空')
      } else if (value.length < 6 || value.length > 14) {
        return new Error('密码长度必须为6-14位')
      }
      return true
    },
    trigger: ['input', 'blur']
  }
}
const message = useMessage()

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
      await userStore.toLogin(userData.username, userData.password)
      // 登录成功进入我的页面
      router.replace('/my')
      message.success('登录成功!')
    }
  } catch (error) {
    console.log(error)
  }
}

defineOptions({
  name: 'Login'
})
</script>

<style scoped lang='scss'>
.page-container {
  padding: 10vh 20px;
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

@media screen and (max-width:651px) {
  .page-container {
    .main-content {
      width: 100%;
    }
  }
}
</style>