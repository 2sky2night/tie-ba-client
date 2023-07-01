import type { App } from 'vue'
import components from '@/components/index'

export default function (app: App) {
  Object.entries(components).forEach(([key, value]) => {
    app.component(key, value)
  })
}