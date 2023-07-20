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
          <n-form-item :size="isMobile ? 'medium' : 'large'" :show-require-mark="false" path="username" label="用户名">
            <n-input v-model:value.trim="userData.username" :placeholder="tips.formPlaceholder('用户名')" />
          </n-form-item>
          <n-form-item :size="isMobile ? 'medium' : 'large'" :show-require-mark="false" path="password" label="密码">
            <n-input type="password" show-password-on='click' :placeholder="tips.formPlaceholder('密码')"
              v-model:value="userData.password" />
          </n-form-item>
        </n-form>
        <div class="btns mt-10">
          <n-button :size="isMobile ? 'medium' : 'large'" class="mr-10" style="width: 50%;"
            @click="onHandleReset">重置</n-button>
          <n-button :size="isMobile ? 'medium' : 'large'" type="primary" style="width: 50%;"
            @click="onHandleSubmit">登录</n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
// hooks
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useUserStore from '@/store/user'
import { useMessage } from 'naive-ui'
import useIsMoblie from '@/hooks/useIsMobile'
// types
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
// components
import Logo from '@/components/common/Logo/index.vue'
// tips
import tips from '@/config/tips'

const isMobile = useIsMoblie()
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
  username: '',
  password: ''
})
// 表单验证规则
const rules: FormRules = {
  username: {
    required: true,
    validator (_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error(tips.formNotEmpty('用户名'))
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
      }
      return true
    },
    trigger: [ 'input', 'blur' ]
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

// 清除用户输入的左右空串
watch(() => userData.username, () => {
  userData.username = userData.username.trim()
})

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

@media screen and (max-width:650px) {
  .page-container {
    .main-content {
      width: 100%;
    }
  }
}
</style>