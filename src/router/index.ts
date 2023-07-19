import { createRouter,createWebHistory } from 'vue-router'
import routes from './routes'
import { afterHook, beforeEachHook } from './guards'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(beforeEachHook)

router.afterEach(afterHook)

export default router