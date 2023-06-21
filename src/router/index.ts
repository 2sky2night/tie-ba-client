import { createWebHashHistory, createRouter } from 'vue-router'
import routes from './routes'
import { afterHook, beforeEachHook } from './guards'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(beforeEachHook)

router.afterEach(afterHook)

export default router