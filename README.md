## 一、项目起步

### 1.选用技术栈

vue+naive-ui+ts+scss

### 2.页面

一级路由：

首页、发现、登录、注册、搜索

用户相关：我的、用户页、编辑资料、关注、粉丝、发送的帖子、点赞的帖子、收藏的帖子、创建的吧、关注的吧

帖子相关：帖子、点赞帖子的用户、收藏帖子的用户、发送帖子

吧相关：吧、关注吧的用户、创建吧

二级路由：

搜索：搜索用户、评论、帖子内容、帖子标题、吧

发现：发现吧、发现评论、发现热帖、发现帖子

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





## 二、遇到的问题

1.项目配置别名

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

2.自动导入的组件不能正确的提示ts类型

​	当用了unplugin-vue-components后，在项目中自动引入的组件类型都为any，不太好为其配置组件的属性，每次都需要在文档中查看api。但是component.d.ts却有对应组件的类型定义，如何解决？

![image-20230620172137194](D:\program_ym\tie-ba\static\image-20230620172137194.png)

这个主要看组件库的**是否提供**了对于每个组件的类型定义文件，比如我使用的naive-ui在其包文件中就提供了volar.d.ts文件，是所有组件的类型定义，比如element-plus就在在其包文件中就提供了global.d.ts文件。

然后在ts.config.json中添加属性，naive-ui为对应包名，包下面有volar.d.ts文件只需要写文件名称即可，不包括.d.ts：

```ts
{
    "types": ["naive-ui/volar"]
}
```

成功：

![image-20230620172706891](D:\program_ym\tie-ba\static\image-20230620172706891.png)