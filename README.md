一、项目起步

1.选用技术栈

vue+naive-ui+ts+scss

2.页面

一级路由：

首页、发现、登录、注册、搜索

用户相关：我的、用户页、编辑资料、关注、粉丝、发送的帖子、点赞的帖子、收藏的帖子、创建的吧、关注的吧

帖子相关：帖子、点赞帖子的用户、收藏帖子的用户、发送帖子

吧相关：吧、关注吧的用户、创建吧

二级路由：

搜索：搜索用户、评论、帖子内容、帖子标题、吧

发现：发现吧、发现评论、发现热帖、发现帖子

3.布局

800px以上：顶部导航栏，中间为视图区，在1400px以上时导航栏和主视图居中显示

800px以下：顶部导航栏，中间为视图区，底部tabbar

二、遇到的问题

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