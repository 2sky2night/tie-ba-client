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
// 引入全局样式
import '@/styles/index.css'
// 全局组件
import globalComponents from './globalComponents';
// 全局指令
import globalDirectives from './globalDirectives';
export default {
  install(app) {
    app.use(store)
    app.use(router)
    globalComponents(app)
    globalDirectives(app)
  }
} as Plugin