## 一、项目起步

### 1.选用技术栈

vue+naive-ui+ts+scss

### 2.页面

**一级路由：**

首页、发现、登录、注册、搜索

用户相关：我的、用户页、编辑资料、关注、粉丝

帖子相关：帖子、发送帖子、浏览的历史帖子

吧相关：吧、创建吧

**二级路由：**

搜索：搜索用户、评论、帖子内容、帖子标题、吧

发现：发现吧、发现评论、发现热帖、发现帖子

吧：关注该吧的用户、吧的帖子列表

**页面中的其他内容（非路由部分）：**

我的、用户页包含了：用户点赞、收藏、发送的帖子，用户创建、关注的吧。

帖子包含了：收藏、点赞的用户列表，以及评论列表

关注、粉丝包含了：用户列表，搜索用户列表

编辑资料包含了：编辑用户信息、修改密码

### 3.布局

800px以上：顶部导航栏，中间为视图区，在1400px以上时导航栏和主视图居中显示

800px以下：顶部导航栏，中间为视图区，底部tabbar

### 4.搭建布局

1.header

1.1搭建导航菜单

​	导航菜单是需要根据当前是否登录用户从而展示不同的导航菜单项，在后期可以在仓库中保存用户信息来判断是否登录用户，动态的渲染菜单。目前还是死的菜单，通过传入的导航菜单列表，渲染菜单项，二级路由通过下拉菜单组件来渲染。

导航项

```vue
<template>
  <div class="nav-item-container">

    <!--有子路由-->
    <template v-if="children">
      <n-dropdown trigger="hover" :options="options" @select="onHandleSelect">
        <n-button :type="isActive ? 'primary' : 'default'" :quaternary="!isActive" @click="onNavigationTo">
          {{ title }}
        </n-button>
      </n-dropdown>
    </template>

    <!--无子路由-->
    <template v-else>
      <n-button :type="isActive ? 'primary' : 'default'" :quaternary="!isActive" @click="onNavigationTo">
        {{ title }}
      </n-button>
    </template>

  </div>
</template>

<script lang='ts' setup>
// types 
import type { NavigationItemProps } from '@/types/components/layout'
import type { DropdownOption } from 'naive-ui';
// hooks
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue'

// 路由对象
const router = useRouter()

// 路由元信息
const route = useRoute()

// 自定义属性
const props = defineProps<NavigationItemProps>()

// 下拉菜单项
const options: DropdownOption[] = props.children ? props.children.map(ele => {
  return {
    key: ele.path,
    label: ele.title
  }
}) : []

/**
 * 选择某个子路由后的回调 执行路由跳转
 * @param path 某个路由的路径
 */
const onHandleSelect = (path: string) => {
  router.push(path)
}

/**
 * 导航一级路由
 */
const onNavigationTo = () => {
  router.push(props.path)
}

/**
 * 若激活了当前路由或子路由就会高亮
 */
const isActive = computed(() => {
  return route.matched.some(ele => ele.path === props.path)
})

</script>
```

导航组件

```vue
<template>
  <div class="nav-container">
    <template v-for="item in routesList">
      
      <template v-if="item.children">
        <NavigationItem :key="item.path" :path="item.path" :title="item.title" :children="item.children" />
      </template>

      <template v-else>
        <NavigationItem :key="item.path" :path="item.path" :title="item.title" />
      </template>

    </template>
  </div>
</template>

<script lang='ts' setup>
// configs
import { authNavigations, noAuthNavigations } from './configs'
// components
import NavigationItem from './components/NavigationItem.vue';
// hooks
import { reactive } from 'vue'

const routesList = reactive(JSON.parse(JSON.stringify(noAuthNavigations)))

defineOptions({
  name: 'Navigations'
})
</script>

<style scoped lang='scss'>
.nav-container {
  display: flex;
}
</style>
```

1.2搭建用户菜单

​	用户菜单也是根据不同的登录状态有不同的用户菜单，需要根据当前登录的用户状态，动态渲染菜单。在后期搭建用户仓库后会根据用户登录状态来渲染不同的菜单列表

```vue
<template>
  <div class="menu-container">
    <n-dropdown trigger="hover" :options="menu" @select="onHandleSelect">
      <n-avatar class="user" round src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
    </n-dropdown>
  </div>
</template>

<script lang='ts' setup>
// hooks
import { useRouter } from 'vue-router';
import { reactive } from 'vue'
// configs
import { authMenu, noAuthMenu } from './configs'

// 路由对象
const router = useRouter()

// 菜单
const menu = reactive(Object.assign([],noAuthMenu))

/**
 * 点击下拉菜单的回调
 * @param key key值
 */
const onHandleSelect = (key: string) => {
  if (key.includes('/')) {
    // 包含/则为路由跳转
    router.push(key)
  } else {
    // 功能按钮 需要执行对应操作
    console.log(key)
  }
}

defineOptions({
  name: 'Menu'
})
</script>

<style scoped lang='scss'>
.menu-container {
  display: flex;
  align-items: center;

  :deep(.user) {
    cursor: pointer;
  }
}
</style>
```

1.3搭建tabbar

在登录和未登录状态下有不同的tabbar项，后期根据仓库用户信息来判断是否登录来动态渲染tabbar

```ts
<template>
  <div class="tab-bar-container">
    <TabBarItem v-for="item in tabBarList" :path="item.path" :title="item.title" :icon="item.icon" :key="item.path"></TabBarItem>
  </div>
</template>

<script lang='ts' setup>
// hooks
import {reactive} from 'vue'
// components
import TabBarItem from './components/TabBarItem.vue';
// configs
import { authTabBar, noAuthTabBar } from './configs'

const tabBarList = reactive(Object.assign([],noAuthTabBar))

defineOptions({
  name: 'TabBar'
})
</script>

<style scoped lang='scss'>
.tab-bar-container {
  height: 100%;
  display: flex;
}
</style>
```

### 5.页面设计

计划的页面有：

首页、**发现（发现帖子、发现热帖、发现评论、发现吧）**、**我的**、**用户**、**搜索（帖子内容、帖子标题、用户、评论、吧）**、帖子、吧（吧的帖子、关注该吧的用户）、 **编辑用户**、粉丝、关注、浏览的历史帖子、创建吧、发送帖子、登录、注册

帖子列表相关的页面：用户发送的帖子、用户收藏的帖子、用户点赞的帖子、首页、历史帖子、发现帖子、发现热帖、搜索帖子、搜索帖子内容

用户列表相关的页面：粉丝、关注、关注该吧的用户

吧列表相关的页面：用户关注的吧、发现吧、搜索吧

使用设计的工具：https://rp.mockplus.cn/editor/dmGealXRJbxW/Zc6pXyt1W

#### 1.登录页

<img src="C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623093853503.png" alt="image-20230623093853503" style="zoom:50%;" />

#### 2.注册页

![image-20230623094055251](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623094055251.png)

#### 3.首页、浏览的历史帖子

![image-20230623103633377](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623103633377.png)

#### 4.发现页

![image-20230623104053303](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623104053303.png)其子路由都是各个组件项列表+分页组成。

#### 5.我的

![image-20230623151017958](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623151017958.png)

#### 6.用户

![image-20230623151021434](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623151021434.png)

#### 7.搜索

移动端下搜索框靠右对齐

![image-20230623112225793](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623112225793.png)

#### 8.帖子详情

![image-20230623115236407](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623115236407.png)

#### 9.吧

![image-20230623120013995](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623120013995.png)

#### 10.编辑用户

![image-20230623120725695](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623120725695.png)

#### 11.粉丝、关注

![image-20230623122230354](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623122230354.png)

#### 12.创建帖子

![image-20230623151950076](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623151950076.png)

#### 13.创建吧

![image-20230623152148474](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623152148474.png)

### 6.组件设计

#### 1.帖子项

![image-20230623100221854](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623100221854.png)

#### 2.吧项

![image-20230623104647819](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623104647819.png)

#### 3.用户项

![image-20230623105158021](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623105158021.png)

#### 4.评论

![image-20230623113428897](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230623113428897.png)

## 二、遇到的问题

#### 1.项目配置别名

给项目配置别名需要给vite.config.ts和ts.config.json两个配置文件进行配置，给vite配置是为了开发编译时和打包时能够通过别名正确读取对应的文件，给ts配置是为了ts编译器支持能够读取对应文件，能够推断出导入文件的类型。

vite.config.ts

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})
```

ts.config.json

只需要添加如下配置即可。

```json
{
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
}
```

#### 2.自动导入的组件不能正确的提示ts类型

​	当用了unplugin-vue-components后，在项目中自动引入的组件类型都为any，不太好为其配置组件的属性，每次都需要在文档中查看api。但是component.d.ts却有对应组件的类型定义，如何解决？

<img src="https://github.com/2sky2night/tie-ba-client/blob/master/static/image-20230620172137194.png?raw=true" alt="image-20230623093853503" style="zoom:50%;" />

这个主要看组件库的**是否提供**了对于每个组件的类型定义文件，比如我使用的naive-ui在其包文件中就提供了volar.d.ts文件，是所有组件的类型定义，比如element-plus就在在其包文件中就提供了global.d.ts文件。

然后在ts.config.json中添加属性，naive-ui为对应包名，包下面有volar.d.ts文件只需要写文件名称即可，不包括.d.ts：

```ts
{
    "types": ["naive-ui/volar"]
}
```

成功：

![image-20230620172706891](https://github.com/2sky2night/tie-ba-client/blob/master/static/image-20230620172706891.png?raw=true)

3.在ts项目中给window全局对象添加属性

这样定义后，访问window对象上的该属性时就会有正确的ts支持

```ts
import type { MessageApi } from 'naive-ui'
export { };

declare global {
  interface Window {
    /**
     * naive-ui的消息组件api
     */
    $message: MessageApi
  }
}
```



#### 4.scss的新写法

​	原先v-deep的写法会生效，但是会报警告

![image-20230621173759351](https://github.com/2sky2night/tie-ba-client/blob/master/static/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20230621173731.png?raw=true)

## 三、页面

### 1.登录

基本逻辑就是收集数据，校验错误，发送请求登录，登录成功进入我的页面

```vue
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
            <n-input v-model:value.trim="userData.username" placeholder="请输入用户名" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item  :show-require-mark="false"  path="password" label="密码">
            <n-input type="password" show-password-on='click' placeholder="请输入密码" v-model:value="userData.password"
              @keydown.enter.prevent />
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
  password: '123456',
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
const message= useMessage()

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
      router.push('/my')
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

@media screen and (max-width:650px) {
  .page-container {
    .main-content {
      width: 100%;
    }
  }
}
</style>
```

### 2.注册

​	注册一样，收集表单，校验表单，发送请求注册用户，进入登陆页面