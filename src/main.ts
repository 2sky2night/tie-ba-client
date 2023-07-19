import { createApp } from 'vue'
import App from './App.vue'
import plugins from './plugins'

// 生产模式下关闭浏览器log调试
if (import.meta.env.MODE !== 'development') {
  console.log=()=>{}
}

const app = createApp(App)
app.use(plugins)
app.mount('#app')
