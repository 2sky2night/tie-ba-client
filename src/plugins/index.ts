// typs
import type { Plugin } from 'vue';
// 仓库插件
import store from '@/store';
// 路由插件
import router from '@/router';
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
// 引入进度条nprogress样式
import 'nprogress/nprogress.css'

export default  {
  install(app){
    app.use(store)
    app.use(router)
  }
} as Plugin