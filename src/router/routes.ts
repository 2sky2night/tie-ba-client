import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name:'home',
    component: () => import("@/views/home/index.vue"),
    meta: {
      needAuth: false,
      title:'首页'
    }
  },
  {
    path: '/discover',
    name:'discover',
    component: () => import("@/views/discover/index.vue"),
    meta: {
      needAuth: false,
      title:'发现'
    }
  },
  {
    path: '/login',
    name:'login',
    component: () => import("@/views/login/index.vue"),
    meta: {
      needAuth: false,
      title:'登录'
    }
  },
  {
    path: '/register',
    name:'register',
    component: () => import("@/views/register/index.vue"),
    meta: {
      needAuth: false,
      title:'注册'
    }
  },
  {
    path: '/my',
    name:'my',
    component: () => import("@/views/my/index.vue"),
    meta: {
      needAuth: true,
      title:'我的'
    }
  }
]

export default routes