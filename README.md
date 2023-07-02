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

**需要登录的页面**

我的、编辑资料、发送帖子、创建吧、发现帖子

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



#### 5.独享前置全局守卫阻止全局前置守卫执行的方法

​	其实只需要独享守卫中next（false）即可，只能是这种方法，他代表终止路由切换。但是后置守卫依旧会执行。

```ts
/**
 * 登录页面的路由独享守卫
 * @param to 
 * @param from 
 * @param next 
 */
export const loginRoutesHook: NavigationGuardWithThis<undefined> = (to, from, next) => {
  const userStore = useUserStore()
  if (userStore.isLogin) {
    // 跳转回上一个页面
    window.$message.warning('请勿重复登录!')
    next(false)
  } else {
    next()
  }
}
```







## 三、页面

### 1.登录

基本逻辑就是收集数据，校验错误，发送请求登录，登录成功进入我的页面

### 2.注册

​	注册一样，收集表单，校验表单，发送请求注册用户，进入登陆页面即可。

### 3.我的

​	展示用户基本信息，以及查看我相关的数据，以及跳转到粉丝、关注、编辑信息页

### 4.用户

​	通过查询参数浏览用户信息，查询参数更新时也要更新页面，若当前登陆的用户访问用户页，需要被重定向到我的页面。

​	关注：当前用户登录了才能就行关注操作；若对该用户是关注状态，点击则取消关注；若当前未关注用户，点击则关注用户

### 5.关注和粉丝页

​	分页浏览用户列表，可以通过搜索来查模糊匹配用户

## 四、render渲染组件函数

### 1.modal-message模态框消息组件

​	是模态框，但是功能没有模态框这么复杂，只提供简单的数据展示的模态框，没有取消、确认等功能，但比message提示更重，是全局提示的一种，占满整个屏幕，提供默认插槽供使用时传入自定义模板内容。布局为上下结构，上为message的标题和关闭按钮，下为默认插槽的内容，供展示数据。调用函数时需要传入标题、渲染默认插槽的函数

![image-20230626212128318](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230626212128318.png)

### 2.用户信息渲染组件

​	底层调用modal-message函数，传入渲染函数内容作为modalMessage的内容呈现。使用图表来呈现

### 3.图片预览渲染组件

​	接收一个src参数，调用函数即可预览图片

## 五、组件

### 1.鉴权按钮

​	由于页面中许多按钮都需要登录后才能操作，所以就封装了一个鉴权按钮，其核心逻辑就是给按钮外面包裹一层元素（叫他box1），当点击内层的元素时，利用浏览器的事件捕获和事件处理函数在捕获时执行这两个机制可以捕获里层的点击事件并执行时机比里层的点击处理函数要早，在box1的点击处理函数触发时，我们可以通过判断是否登录的逻辑，使用stopImmediatePropagation或stopPropagation浏览器是否继续执行事件捕获。

​	stopPropagation、stopImmediatePropagation都可以停止事件捕获或冒泡，不过区别在于stopImmediatePropagation会停止当前元素绑定的其他事件监听处理函数的执行。

​	给box1绑定点击事件，这样就能监听里面的元素的点击事件了，同时为了让box1的click事件执行优先级比里层的click事件执行时机早，可以让事件处理函数在捕获时触发，这样就能在点击事件触发时

### 2.关注用户按钮

​	由于关注用户的ui和逻辑非常多，所以索性就封装成组件了，由于是需要登陆的操作，外层就套了层鉴权按钮。

### 3.用户帖子、吧等数据组件

​	该组件由多个板块组成，逻辑不复杂，但是内容太多了，所以封装成组件，可以在用户和我的页面中使用。

### 4.无限加载帖子列表

​	对于用户页、我的页的页面展示没办法使用分页（主要是分页想使用路由查询参数来控制），所以就封装了帖子列表组件。通过传入获取帖子的函数来获取帖子列表

​	该帖子列表可以根据需要传入props来控制每页加载多少项，以及帖子的升序降序

### 5.帖子项

​	展示帖子基本信息、发帖人信息、对应所属吧的信息。用户可以浏览帖子的图片，以及点赞、收藏帖子等功能。

### 6.吧项

​	展示吧的基本信息，关注吧

### 7.无限加载的吧列表

​	通过传入对应获取数据列表的函数来获取吧列表

### 8.关注吧按钮

​	关注吧按钮，提供用户关注吧的操作，并且外套一个auth-btn，对点击事件进行捕获鉴权

### 9.用户列表组件

​	用户列表组件，通过传入获取数据的函数，在页数更新的时候去调用，所以需要监听当前页数。并且监听路由查询参数page，当page更新时调用获取数据的函数。向外暴露整个分页数据，好让外部操作分页数据，在路由更新的特殊情况更新数据。

## 六、指令

### 1.图片懒加载指令

​	使用vueuse实现容器进入视口加载图片。

### 2.图片预览指令

​	给img绑定该指令传入图片的src，在img被渲染时会给他绑定一个事件处理函数，点击图片就会调用图片预览组件函数

## 七、钩子

### 1.检查路由参数的钩子

​	返回一个检查路由的函数 减少重复代码，不过只能检查一个参数，且参数类型为number型，调用函数可以获取到解析成功的结果,可以传入路由元数据，来检查不同路由的参数，例如to或当前路由

```ts
import { useRoute, useRouter, RouteLocationNormalizedLoaded } from "vue-router";
import { useMessage } from "naive-ui";
import tips from "@/config/tips";

/**
 * 检查路由参数(只能检查一个参数 且参数检查的类型为number)
 * @param key 路由参数中的那个key 
 * @param type params参数还是query参数
 */
export default function (key: string, type: 'params' | 'query' = 'params') {

    const route = useRoute()
    const router = useRouter()
    const message = useMessage()

    /**
     * 检查路由参数 (传入路由信息,默认为当前路由)
     * @param currentRoutes 需要检查的路由 
     * @returns 
     */
    function checkRoutes(currentRoutes: RouteLocationNormalizedLoaded = route) {
        const value = currentRoutes[type][key]
        if (value) {
            // 携带参数
            const temp = +value
            if (isNaN(temp)) {
                // 参数非法
                message.error(tips.errorParams)
                router.replace('/')
                return Promise.reject()
            } else {
                return Promise.resolve(temp)
            }
        } else {
            // 未携带参数
            message.error(tips.emptyParams)
            router.replace('/')
            return Promise.reject()
        }
    }

    return checkRoutes
}
```

### 2.分页钩子

​	初始化时检验page参数是否携带，未携带或非法会重置为1，合法就以该值初始化分页数据，在分页更新时进行会路由跳转，在路由更新时会校验参数是否合法，合法就获取数据，非法就重置页数

```ts
import { formatNumber } from '@/utils/tools'
import { reactive, watch } from 'vue'
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router'

/**
 * 分页的钩子函数 传入获取数据的函数
 * 监听页码或路由查询参数page更新
 * 支持校验路由的page参数
 * @param cb 
 * @returns 
 */
export default function (cb: any) {

    const router = useRouter()
    const route = useRoute()
    let routePage = 1

    // 初始化解析路由参数page
    if (route.query.page !== undefined) {
        const res = formatNumber(route.query.page as string)
        if (typeof res === 'number') {
            // 是一个数字
            if (res < 1) {
                // 小于一 重置为1 更新路由
                router.replace({ path: route.path, query: { ...route.query, page: 1 } })
            } else {
                routePage = res
            }
        } else {
            // 不是一个数字 重置为1 更新路由
            router.replace({ path: route.path, query: { ...route.query, page: 1 } })
        }
    } else {
        // 未携带page参数
        router.replace({ path: route.path, query: { ...route.query, page: 1 } })
    }

    const pagination = reactive({
        page: routePage,
        pageSize: 20,
        total: 0,
        has_more: false
    })

    // 页长度更新的回调
    watch(() => pagination.pageSize, () => {
        if (pagination.page === 1) {
            cb()
            router.push({ path: route.path, query: { ...route.query, page: 1 } })
        } else {
            pagination.page = 1
        }

    })

    // 页码更新的回调
    watch(() => pagination.page, (v) => {
        cb()
        router.push({ path: route.path, query: { ...route.query, page: v } })
    })


    // 路由更新时解析路由 (路由查询参数更新的回调)
    onBeforeRouteUpdate((to) => {
        if (to.query.page !== undefined) {
            const res = formatNumber(to.query.page as string)
            if (typeof res === 'number') {
                // 是一个数字
                if (res < 1) {
                    // 小于一 重置为1 更新路由
                    pagination.page = 1
                    router.replace({ path: to.path, query: { ...to.query, page: 1 } })
                } else {
                    // 大于1 获取页码
                    pagination.page = res
                }
            } else {
                // 不是一个数字 重置为1 更新路由
                pagination.page = 1
                router.replace({ path: to.path, query: { ...to.query, page: 1 } })
            }
        } else {
            // 未携带参数
            pagination.page = 1
            router.replace({ path: to.path, query: { ...to.query, page: 1 } })
        }
    })

    return pagination
}
```



## 八、问题

### 1.withDefaults声明props默认值

在为**数组类型的自定义属性声明默认值时**，应该使用getter函数来声明，否则会报错

​	自定义属性类型：

![](D:\随便写写\tie-ba-client\static\截图_2023-07-01_16-10-42.png)

![](D:\随便写写\tie-ba-client\static\截图_2023-07-01_16-11-30.png)

## 零、time

6.23

1.主题切换菜单栏同时更新文本
2.用户登出功能
3.登陆页面的独享守卫，禁止以及登陆的用户进入该页面。
4.前置守卫的路由鉴权
5.修改导航栏的登陆状态切换时，二级路由key值相同复用导致错误的渲染内容

6.我的页面（用户模块搭建）
7.搭建编辑页面
8.用户页面（用户模块搭建），若当前登陆的用户访问自己，则通过路由独享前置返回我的页面，关注（交互未实现），路由更新重新加载用户数据

6.25

1.用户页的关注和取消关注

2.头部下拉菜单栏添加头部内容，根据当前登录状态渲染不同内容

7.1

1.用户的帖子、吧等数据组件封装（userViews）

2.修改user路由配置，从原来的查询参数修改为params参数

3.配置全局自定义指令，图片懒加载指令

4.图片预览指令和图片预览组件

5.帖子列表、空内容组件的封装

6.帖子项组件的封装

7.吧项组件，吧列表组件

7.2

1.用户和我的页面添加创建时间

2.粉丝、关注的api封装

3.封装检查路由参数的钩子（参数的值必须为number型，且只能检查一个参数）

4.更新关注用户按钮，添加更新粉丝数量的自定义事件

5.用户列表

6.分页钩子

7.关注、粉丝页搭建了50%