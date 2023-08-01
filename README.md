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



#### 6.watch的执行时机

​	watch，千万别写在onMounted等其他任意钩子里面，可能会引发特别奇怪的bug



#### 7.v-model和自动绑定的自定义事件的执行时机

 例如当前有个封装好的组件：

（在该例子中当自定义事件update:value触发时，会执行两次回调，一次是v-model，一次是开发者自己绑定的回调）

```vue
<TypeSelector v-model:value="hotType"  @update:value="onHandleUpdata"></TypeSelector>
```

该组件的props和emits声明:

```ts
defineProps<{
  value:HotType
}>()
const emits = defineEmits<{
  'update:value':[value:HotType]
}>()
```

则当内部emit函数执行'update:value'时，外部使用的组件事件触发顺序为 v-model---->自己绑定的回调。

则此时当执行onHandleUpdata时可以获取到最新的值。我们可以通过vue的render函数中，可以看见其自定义事件绑定的顺序

```ts
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BarListInf = __unplugin_components_0;
  return _openBlock(), _createElementBlock("div", _hoisted_1, [
    _createVNode($setup["TypeSelector"], {
      class: "mb-10",
      value: $setup.hotType,
      "onUpdate:value": [
        _cache[0] || (_cache[0] = ($event) => $setup.hotType = $event),
        $setup.onHandleUpdata
      ]
    }, null, 8, ["value"]),
    _createVNode(
      _component_BarListInf,
      {
        ref: "listIns",
        "get-list": $setup.onHandleGetData
      },
      null,
      512
      /* NEED_PATCH */
    )
  ]);
}
```

若我们修改v-model和自定义事件的回调的绑定顺序时

```vue
  <TypeSelector class="mb-10" @update:value="onHandleUpdata" v-model:value="hotType"  ></TypeSelector>
```

当自定义事件触发时，执行顺序会是：自己绑定的回调---v-model，也就是说开发者自己绑定的回调中此时的依旧是更新前的值

以下为vue给出的渲染函数

```ts
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BarListInf = __unplugin_components_0;
  return _openBlock(), _createElementBlock("div", _hoisted_1, [
    _createVNode($setup["TypeSelector"], {
      class: "mb-10",
      "onUpdate:value": [
        $setup.onHandleUpdata,
        _cache[0] || (_cache[0] = ($event) => $setup.hotType = $event)
      ],
      value: $setup.hotType
    }, null, 8, ["value"]),
    _createVNode(
      _component_BarListInf,
      {
        ref: "listIns",
        "get-list": $setup.onHandleGetData
      },
      null,
      512
      /* NEED_PATCH */
    )
  ]);
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

​	分页浏览用户列表，有搜索模式和普通模式

### 6.首页

​	无限加载浏览帖子项

### 7.帖子详情页

​	帖子详情页，上方就是帖子的详情数据，下方就是一个tab面板(浏览评论、查看点赞、收藏该帖子的人)。

​	移动端650px以下底部有个操作栏，可以发送评论 点赞帖子 收藏帖子操作，也可以给评论配图。

​	下方的tab面板的效果做了1个小时😢

### 8.吧详情页

​	吧详情页，上方展示吧的详情信息以及吧主的信息，下方展示一个tab面板，用来展示该吧的帖子，以及关注改吧的用户。

### 9.编辑

​	编辑用户信息分为，编辑密码和编辑用户基本信息，通过tab栏面板切换显示。

### 10.发帖

​	发帖页做了基本的表单收集，用户可以选择帖子的配图，选择发送到那个吧（暂定可以发送到任意吧里面去）

### 11.创建吧

​	创建吧同样也是基本的表单收集，用户可以上传图片配置吧的头像

### 12.历史页

​	用户浏览的帖子会以帖子id的形式保存在本地，在用户浏览历史页时会分页展示帖子列表，同时封装的SwiperCell可以让用户删除历史记录。

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

### 10.真无限加载的帖子列表组件

​	真无限加载是通过滚动条是否滚动到底部来发送请求获取更多数据，由于这个项目布局是定宽定高的，只有中间主视图容器是有滚动条的，所以就去监听这个DOM元素是否滚动到底部来加载更多数据。

​	具体的实现思路：

​	1.为了节约浏览器性能，所以给主视图容器的scroll事件监听是按需开启的，通过pubsub关注后代组件是否需要开启事件监听。主视图容器通过一个响应式数据来记录当前是否滚动到底部，并将该数据依赖注入给后代组件

​	2.后代组件通过依赖注入的响应式数据来判断是否滚动到底部，来决定是否加载更多数据，后代组件被卸载或不需要加载更多数据时就通过pubsub来取消主视图容器的scroll监听。

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

### 2.同一个事件挂载多个回调

​	若一个元素，挂载了多个同事件的处理函数，则执行顺序按照挂载顺序执行。

```html
    <button>btn</button>
    <script>
      const onHandleClick01 = () => {
        console.log('点我干嘛01')
      }
      const onHandleClick02 = () => {
        console.log('点我干嘛02')
      }
      const btn = document.querySelector('button')
      btn.addEventListener('click', onHandleClick02)
      btn.addEventListener('click', onHandleClick01)
      // 点击时 02先执行
    </script>
```

​	若一个元素，挂载了多个同事件的处理函数，且这些事件的处理函数的指针都是同一个对象，则事件触发时只会执行一次

```html
    <button>btn</button>
    <script>
      const onHandleClick = () => {
        console.log('点我干嘛')
      }
      const btn = document.querySelector('button')
      btn.addEventListener('click', onHandleClick)
      btn.addEventListener('click', onHandleClick)
      // 点击时 只会执行一次回调
    </script>
```

### 3.h函数渲染插槽和组件的自定义事件

#### 	1.h函数渲染插槽的方式:

```ts
import Drawer from '@/components/drawer/index.vue'	
   // 渲染抽屉
  const drawerIns = h(Drawer, { title }, {
    //@ts-ignore 渲染插槽 component为对应引入的组件，props为该组件的自定义属性
    default: () => h(component, props)
  })
```

​	h函数的第三个参数可以给组件渲染插槽，为一个对象，对象的每一个key都为插槽的名称，这里只用了默认插槽所以为default，每个插槽的值都为一个函数，每个函数的返回值都为一个虚拟DOM，所以可以通过h函数来帮助渲染对应组件的虚拟DOM或者也可以直接调用组件的render函数也可以获取组件的虚拟DOM，下面为案例:
```ts
  const drawerIns = h(Drawer, { title }, {
     // 每个key都为插槽的名称
    default: () => component.render()
  })
```
因为在SFC中，组件的tempplate部分最终都会被编译成render函数，render函数的返回值为虚拟DOM，该虚拟DOM就是根据template模板内容来进行生成的，例如：
```vue
<template>
	<h1>你好!</h1>
</template>
```
都会变成
```ts
export default {
	render(){
		return h('h1','你好!')
	}
}
```

#### 2.h函数绑定自定义事件

​	其实就和用h函数给原生html元素绑定事件一样的，on事件名=方法

```ts
  // 渲染抽屉
  const drawerIns = h(Drawer, { title,onCloseDrawer:()=>console.log('h函数绑定的自定义事件触发了') })
```

### 4.ts声明重载

​	JS没有如c++一样函数重载功能（可以声明多个同名函数，因为强类型语言在编译时函数参数的类型就已经确定了，而js弱类型语言只有在运行时才能知晓参数的类型，js只能通过运行时的条件判断来实现重载的效果），所以ts也没有，不过ts可以通过声明函数重载达到重载的效果。重载只能作用与函数声明上，不能作用于匿名函数上。

**注意：函数重载的声明必须和对应函数实现贴在一起写，否则会报错！连什么原因都不知道的那种**

函数重载

```ts
// 声明
function sayHello():void;
function sayHello(says:string):void
// 函数实现
function sayHello (says?: string) {
        if (typeof says === 'undefined') {
            return this.name + ':你好啊'
        } else {
            return this.name + ':' + says
        }
    }
```

错误的重载声明方式:函数重载的声明没有和对应函数实现没有写在一起

```ts
class Person {
    name: string;
    constructor ()
    constructor (name: string)
    sayHello (): void;
    sayHello (says: string): void;
    constructor (name?: string) {
        this.name = name ? name : '张三'
    }
    sayHello (says?: string) {
        if (typeof says === 'undefined') {
            return this.name + ':你好啊'
        } else {
            return this.name + ':' + says
        }
    }
}

```

ts编译的结果

<img src="data:image/png;base64,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">



方法重载

```ts
class Person {
    name: string;
    /**
     * 注意函数重载的声明必须和对应函数实现贴在一起写 不然就会报错
     */
    constructor ()
    constructor (name: string)
    constructor (name?: string) {
        this.name = name ? name : '张三'
    }
    sayHello (): void;
    sayHello (says: string): void;
    sayHello (says?: string) {
        if (typeof says === 'undefined') {
            return this.name + ':你好啊'
        } else {
            return this.name + ':' + says
        }
    }
}

```



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

7.9

1.帖子详情页下的tab栏封装

2.评论组件封装、评论无限加载列表组件、修改列表组件的props依赖为外部类型引入

3.用户无限加载列表

4.帖子详情基本完成